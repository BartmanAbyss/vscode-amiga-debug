/*	HDW_CallBackMsgs.h
 *	Callback messages for the hdwrench.library tester program.
 *	These strings are "suggested" English strings for use with
 *	the hdwrench.library callback hook.
 *
 *	$VER: HDW_CallBackMsgs.h 44.1 (11.8.99)
 *	Includes Release 44.1
 *
 *	Disk Prep Support Library API includes
 *
 *	Copyright © 1999 Joanne B. Dow, Wizardess Designs, for future
 *		license to Amiga Inc.
 *		All rights reserved.
 */
#ifndef HDW_CALLBACKMSGS_H

#ifdef USE_SUGGESTED_MESSAGES
	// MESSAGE										// .extra usages
char *callback_messages[] =
{
	// A) FINDVALID_SCANNING_STRING					// 0 and 1
	"Scanning: %s: %d%d%d",			// from message: devicename, board, lun, addr

	// B) LONGTIME_NOABORT_WARNING					// 2
	"You are about to format LUN %d on\n"
	"drive %d attached to board %d\n\n"
	"***WARNING WARNING WARNING***\n"
	"It can take up to several hours\n"
	"to format a hard disk. And there\n"
	"is no safe way to abort.\n\n"
	"Are you VERY sure you want to do this?\n",
	// C) LONGTIME_VERIFY_WARNING					// 3
	"LUN %d on drive %d on board %d\n"
	"            Note\n"
	"It can take up to several hours\n"
	"to verify a hard disk. However,\n"
	"you can abort during verify.\n\n"
	"No data will be changed on the\n"
	"drive.\n\n"
	"Do you wish to continue?\n",

	// D) FORMAT_USER_ABORTED_STRING				// 6
	"User Aborted. Your drive is safe!\n",

	// E) FORMAT_MOUNTED_DRIVE						// 4
	"%s\nShould we format a mounted drive?\n",

	// F) FORMAT_NOT_PERMITTED						// 6
	"%s\nFormatting the system disk\nis not permitted. Aborting...\n",

	// G) FORMAT_UNRECOGNIZED_STATUS				// 6
	"Unrecognized SCSI status byte 0x%2.2x returned.\n",

	// H) FORMAT_RESERVATION_CONFLICT				// 6
	"Device is reserved by another initiator.\n",

	// I) FORMAT_DRIVE_BUSY							// 6
	"Drive is busy.\n",

	// J) FORMAT_COMMAND_PROBLEM					// 6
	"Unknown problem issuing SCSI Direct command!\n",

	// K) FORMAT_SUCCESS_STRING						// 6
	"Format completed with no errors.",

	// L) FORMAT_FAILED_STRING						// 6 maybe
	"Format failed! Your drive may be dead.\n",

	// M) VERIFY_USER_ABORTED_STRING				// 6
	"User Aborted.\n",

	// N) VERIFY_READCAPACITY_FAILED				// 6
	"ReadCapacity failed! Verify impossible.\n",

	// O) VERIFY_PROGRESS							// 4
	"Verifying blocks %d to %d of %d.\r",

	// P) VERIFY_REASSIGN_Q							// 5
	"Block %d is bad.\n"
	"Reassign this bad block?",

	// Q) VERIFY_COMPLETED_STRING					// 6
	"Verify completed:\n"
	"    %d errors,\n"
	"    %d successful reassignments,\n"
	"and %d failed reassignments\n",

	// R) VERIFY_ERROR_UNKNOWN_LOC					// 4
	"Medium error at unknown location!\n"
	"You should back up the drive and low-level format\n",

	// S) VERIFY_HARDWARE_ERROR						// 4
	"Hardware error %ld!\n",

	// T) VERIFY_RECOVERED_ERROR					// 4
	"Recovered read error at block %ld\n",

	// U) VERIFY_RECOVERED_UNKNOWN_LOC				// 4
	"Recovered error at unknown location!\n"
	"You should consider backing up the\n"
	"drive and reformatting\n",

	// V) VERIFY_ILLEGAL_REQUEST					// 4
	"Drive returned an Illegal Request Error (%ld)\n",

	// W) VERIFY_UNKNOWN_ERROR
	"Unknown error: sense key %ld (more)\n"
	"Device returned sense code %ld (more)\n"
	"Consult drive documentation\n",

	// X) VERIFY_CONTINUE							// 4
	"Continuing verify at block %d...\n",

	// Y) VERIFY_SEEK_ERROR							// 4
	"seek eror!\n",

	// Z) VERIFY_MEDIUM_ERROR						// 4
	"Medium error at unknown location!\n"
	"You should back up the drive and low-level format\n",

	// [) VERIFY_ILLEGAL_COMMAND					// 4
	"Illegal command!\n",

	// \) VERIFY_ILLEGAL_ADDRESS					// 4
	"Illegal address %ld!",

	// ]) VERIFY_BAD_ARGUEMENT						// 4
	"Bad command arguement!\n",

	// ^) VERIFY_CARTRIDGE_CHANGED					// 4
	"Cartridge changed",

	// _) VERIFY_ILLEGAL_LUN						// 4
	"Invalid LUN addressed!",

	// `) VERIFY_UNFORMATTED_DRIVE					// 4
	"Unformatted drive!",

	// a) VERIFY_NONEXTENDED_SENSE					// 4
	"Non-extended sense error is 0x%x",

	// b) VERIFY_NO_SCSI_ERROR_RETURNED				// 4
	"Device didn't return good sense data!",

	//
	"Illegal callback message %x"					// any
};

#define MIN_MESSAGE	'A'
#define MAX_MESSAGE 'b'

#endif

#define HDW_CALLBACKMSGS_H
#endif
