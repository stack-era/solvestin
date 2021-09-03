use crate::schema::invest::Invest;
use crate::{error::AppError, instruction::AppInstruction};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    clock::Clock,
    entrypoint::ProgramResult,
    msg,
    native_token::lamports_to_sol,
    program_error::ProgramError,
    program_pack::Pack,
    pubkey::Pubkey,
    sysvar::Sysvar,
};

fn calculate_time_delta(interval: u64) -> u64 {
    const DAY: u64 = 24 * 60 * 60;
    const WEEK: u64 = 7 * 24 * 60 * 60;
    const MONTH: u64 = 30 * 24 * 60 * 60;

    return match interval {
        0 => DAY,
        1 => WEEK,
        _ => MONTH,
    };
}

// calculate unlocked amount based on intervals like day, week, month
// interval = 0 | 1 | 2 (DAY = 0, WEEK = 1, MONTH = 2)
fn calculate_unlocked_amount(now: u64, start: u64, end: u64, amount: u64, interval: u64) -> u64 {
    let delta = calculate_time_delta(interval);

    // based on interval
    let mut actual_now = start;
    let actual_start = start - delta;
    let actual_end = end - delta;

    loop {
        if actual_now + delta > now {
            break;
        }

        actual_now = actual_now + delta;
    }

    if actual_now + delta <= actual_end {
        msg!("Current Withdrawal Time: {:?}", actual_now);
        msg!("Next Withdrawal Time: {:?}", actual_now + delta);
    } else {
        msg!("Last Withdrawal Time: {:?}", actual_now);
    }

    (((actual_now - actual_start) as f64) / ((actual_end - actual_start) as f64) * amount as f64)
        as u64
}

pub struct Processor {}

impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = AppInstruction::unpack(instruction_data)?;
        match instruction {
            AppInstruction::Init {
                start_time,
                end_time,
                amount,
                interval,
            } => {
                let account_info_iter = &mut accounts.iter();

                let sender = next_account_info(account_info_iter)?;
                let invest_pda = next_account_info(account_info_iter)?;

                // check if pda is created
                if invest_pda.data_is_empty() {
                    return Err(ProgramError::UninitializedAccount);
                }

                // owner check
                if invest_pda.owner != program_id {
                    return Err(AppError::IncorrectProgramId.into());
                }

                msg!(
                    "Locking {} SOL for Duration(in sec) {}",
                    lamports_to_sol(amount),
                    end_time - start_time
                );

                // provided timestamps check
                let now = Clock::get()?.unix_timestamp as u64;
                if start_time < now {
                    msg!("Start Time must be greater than Current Time");
                    return Err(ProgramError::InvalidArgument);
                }
                if end_time < start_time {
                    msg!("Start time can not be greater than End Time");
                    return Err(ProgramError::InvalidArgument);
                }

                // TODO: check end_time must be greater than start_time + time_delta

                let mut data = Invest::unpack(&invest_pda.data.borrow())?;
                data.amount = amount;
                data.start_time = start_time;
                data.end_time = end_time;
                data.interval = interval;
                data.withdrawal_count = 0;
                data.sender = sender.key.to_bytes();

                Invest::pack(data, &mut invest_pda.data.borrow_mut())?;

                Ok(())
            }
            AppInstruction::Withdraw {
                requested_withdrawal_amount,
            } => {
                let account_info_iter = &mut accounts.iter();
                let recipient = next_account_info(account_info_iter)?;
                let invest_pda = next_account_info(account_info_iter)?;

                // checks
                if invest_pda.data_is_empty() || invest_pda.owner != program_id {
                    msg!("Error: Invalid Invest PDA account id");
                    return Err(ProgramError::UninitializedAccount);
                }

                let mut data = Invest::unpack(&invest_pda.data.borrow())?;

                if data.withdrawn == data.amount {
                    msg!("Error: Can not withdraw from closed account");
                    return Err(AppError::InvalidInstruction.into());
                }

                let now = Clock::get()?.unix_timestamp as u64;
                let time_delta = calculate_time_delta(data.interval);

                let available_amount = if now >= data.end_time - time_delta {
                    // we exceed end time all amount is available
                    data.amount - data.withdrawn
                } else {
                    let unlocked_amount = calculate_unlocked_amount(
                        now,
                        data.start_time,
                        data.end_time,
                        data.amount,
                        data.interval,
                    );

                    unlocked_amount - data.withdrawn
                };

                let withdraw_amount = match requested_withdrawal_amount {
                    0 => available_amount,
                    _ => requested_withdrawal_amount,
                };

                if withdraw_amount > available_amount {
                    msg!("Amount requested for withdraw is larger than available amount.");
                    msg!("Requested: {} SOL", lamports_to_sol(withdraw_amount));
                    msg!("Available: {} SOL", lamports_to_sol(available_amount));
                    return Err(ProgramError::InvalidArgument);
                }

                msg!("before ==== withdraw, {:?}", invest_pda.lamports());

                **invest_pda.try_borrow_mut_lamports()? -= withdraw_amount;
                **recipient.try_borrow_mut_lamports()? += withdraw_amount;

                msg!("after ==== withdraw, {:?}", invest_pda.lamports());

                // Update PDA data
                data.withdrawn += withdraw_amount;
                data.withdrawal_count += 1;
                Invest::pack(data, &mut invest_pda.data.borrow_mut())?;

                msg!(
                    "Successfully withdrawn: {} SOL",
                    lamports_to_sol(withdraw_amount)
                );
                msg!(
                    "Remaining: {} SOL",
                    lamports_to_sol(data.amount - data.withdrawn),
                );

                Ok(())
            }
            AppInstruction::Close => {
                let account_info_iter = &mut accounts.iter();
                let sender = next_account_info(account_info_iter)?;
                let recipient = next_account_info(account_info_iter)?;
                let invest_pda = next_account_info(account_info_iter)?;

                msg!("Closing Invest account of User: {}", sender.key);

                // checks
                if invest_pda.data_is_empty() || invest_pda.owner != program_id {
                    msg!("Invalid Invest PDA account id");
                    return Err(ProgramError::UninitializedAccount);
                }

                let mut data = Invest::unpack(&invest_pda.data.borrow())?;

                let now = Clock::get()?.unix_timestamp as u64;
                let unlocked_amount = calculate_unlocked_amount(
                    now,
                    data.start_time,
                    data.end_time,
                    data.amount,
                    data.interval,
                );
                let available_amount = unlocked_amount - data.withdrawn;

                **invest_pda.try_borrow_mut_lamports()? -= available_amount;
                **recipient.try_borrow_mut_lamports()? += available_amount;

                // calculate remaining amount and transfer back to User(sender)
                // TODO: refund all Invest account rent amount to User(sender)
                let remaining_amount = invest_pda.lamports();

                **invest_pda.try_borrow_mut_lamports()? -= remaining_amount;
                **sender.try_borrow_mut_lamports()? += remaining_amount;

                // Update Invest PDA data, for now we will keep the account rented
                data.withdrawn += available_amount;
                Invest::pack(data, &mut invest_pda.data.borrow_mut())?;

                msg!("Successfully Closed Invest Account on {} ", invest_pda.key);
                msg!(
                    "Transferred unlocked {} SOL to {}",
                    lamports_to_sol(available_amount),
                    recipient.key
                );
                msg!(
                    "Returned {} SOL to {}",
                    lamports_to_sol(remaining_amount),
                    sender.key
                );

                Ok(())
            }
        }
    }
}

// TODO: write test cases
