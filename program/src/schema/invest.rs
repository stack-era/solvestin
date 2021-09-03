use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};
use solana_program::{
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
};

//
// Define the data struct
//
#[derive(Clone, Copy, Debug, Default, PartialEq)]
pub struct Invest {
    /// Timestamp when the funds start unlocking
    pub start_time: u64,
    /// Timestamp when all funds should be unlocked
    pub end_time: u64,
    /// Amount of funds locked
    pub amount: u64,
    /// invest interval on of (DAY = 0, WEEK = 1, MONTH = 2)
    pub interval: u64,
    /// total withdrawal til now
    pub withdrawal_count: u64,
    /// Amount of funds withdrawn
    pub withdrawn: u64,
    /// Address of the sender
    pub sender: [u8; 32],
}

//
// Implement Sealed trait
//
impl Sealed for Invest {}

//
// Implement IsInitialized trait
//
impl IsInitialized for Invest {
    fn is_initialized(&self) -> bool {
        true
    }
}

//
// Implement Pack trait
//
impl Pack for Invest {
    // Fixed length
    const LEN: usize = std::mem::size_of::<Invest>();

    // Unpack data from [u8] to the data struct
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, 8 + 8 + 8 + 8 + 8 + 8 + 1 * 32];
        let (
            src_start_time,
            src_end_time,
            src_amount,
            src_interval,
            src_withdrawal_count,
            src_withdrawn,
            sender,
        ) = array_refs![src, 8, 8, 8, 8, 8, 8, 1 * 32];

        let start_time = u64::from_le_bytes(*src_start_time);
        let end_time = u64::from_le_bytes(*src_end_time);
        let amount = u64::from_le_bytes(*src_amount);
        let interval = u64::from_le_bytes(*src_interval);
        let withdrawal_count = u64::from_le_bytes(*src_withdrawal_count);
        let withdrawn = u64::from_le_bytes(*src_withdrawn);

        let invest = Invest {
            start_time,
            end_time,
            amount,
            interval,
            withdrawal_count,
            withdrawn,
            sender: *sender,
        };

        Ok(invest)
    }

    // Pack data from the data struct to [u8]
    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, 8 + 8 + 8 + 8 + 8 + 8 + 1 * 32];
        let (
            dst_start_time,
            dst_end_time,
            dst_amount,
            dst_interval,
            dts_withdrawal_count,
            dst_withdrawn,
            dst_sender,
        ) = mut_array_refs![dst, 8, 8, 8, 8, 8, 8, 1 * 32];

        // Destructure a reference of self to get data to be packed
        let Invest {
            start_time,
            end_time,
            amount,
            interval,
            withdrawal_count,
            withdrawn,
            sender,
        } = self;

        *dst_start_time = start_time.to_le_bytes();
        *dst_end_time = end_time.to_le_bytes();
        *dst_amount = amount.to_le_bytes();
        *dst_interval = interval.to_le_bytes();
        *dts_withdrawal_count = withdrawal_count.to_le_bytes();
        *dst_withdrawn = withdrawn.to_le_bytes();
        *dst_sender = *sender;
    }
}
