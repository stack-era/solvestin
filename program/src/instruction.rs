use crate::error::AppError;
use solana_program::program_error::ProgramError;
use std::convert::TryInto;

#[derive(Clone, Debug, PartialEq)]
pub enum AppInstruction {
    Init {
        start_time: u64,
        end_time: u64,
        amount: u64,
        interval: u64,
    },
    Withdraw {
        requested_withdrawal_amount: u64,
    },
    Close,
}
impl AppInstruction {
    pub fn unpack(instruction: &[u8]) -> Result<Self, ProgramError> {
        let (&tag, rest) = instruction
            .split_first()
            .ok_or(AppError::InvalidInstruction)?;

        Ok(match tag {
            0 => Self::Init {
                start_time: u64::from_le_bytes(rest[0..8].try_into().unwrap()),
                end_time: u64::from_le_bytes(rest[8..16].try_into().unwrap()),
                amount: u64::from_le_bytes(rest[16..24].try_into().unwrap()),
                interval: u64::from_le_bytes(rest[24..32].try_into().unwrap()),
            },
            1 => Self::Withdraw {
                requested_withdrawal_amount: u64::from_le_bytes(rest[0..8].try_into().unwrap()),
            },
            2 => Self::Close,
            _ => return Err(AppError::InvalidInstruction.into()),
        })
    }
}
