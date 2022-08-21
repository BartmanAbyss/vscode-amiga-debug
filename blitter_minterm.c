//-------------------------------------------------------------------------------------------------------------
// Quine–McCluskey Algorithm
// =========================
//-------------------------------------------------------------------------------------------------------------
// English:
//-------------------------------------------------------------------------------------------------------------
// Description: Application to simplify boolean functions with Quine-McCluskey algorithm
// Date: 05/16/2012
// Author: Stefan Moebius (mail@stefanmoebius.de)
// Licence: Can be used freely (Public Domain)
//-------------------------------------------------------------------------------------------------------------
// German:
//-------------------------------------------------------------------------------------------------------------
// Beschreibung: Programm zur Vereinfachung von Booleschen Funktionen mit hilfe des Quine–McCluskey Verfahrens.
// Datum: 16.05.2012
// Author: Stefan Moebius (mail@stefanmoebius.de)
// Lizenz: darf frei verwendet werden (Public Domain)
//-------------------------------------------------------------------------------------------------------------
#include <stdio.h>

#define TRUE 1
#define FALSE 0
#define MAXVARS 7
#define MAX 2048

//Global fields: / Globale Felder:
int minterm[MAX][MAX];
int mask[MAX][MAX];		// mask of minterm  /  Maske des Minterm
int used[MAX][MAX];		// minterm used  /  Minterm wurde verwendet
int result[MAX];		// results  /  Ergebnisse
int primmask[MAX];		// mask for prime implicants  /  Maske für Primimplikant
int prim[MAX];			// prime implicant  /  Primimplikant
int wprim[MAX];			// essential prime implicant (TRUE/FALSE)  /  wesentlicher Primimplikant (TRUE/FALSE)
int nwprim[MAX];		// needed not essential prime implicant  /  benötigter unwesentlicher Primimplikant

//Count all set bits of the integer number  /  Zählen der gesetzen Bits in einer Integerzahl
int popCount(unsigned x) { // Taken from book "Hackers Delight"  / Aus dem Buch "Hackers Delight" 
	x = x - ((x >> 1) & 0x55555555);
	x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
	x = (x + (x >> 4)) & 0x0F0F0F0F;
	x = x + (x >> 8);
	x = x + (x >> 16);
	return x & 0x0000003F;
}

//Calculate hamming weight/distance of two integer numbers  /  Berechnung der Hammingdistanz von 2 Integerzahlen
int hammingWeight(int v1, int v2) {
	return popCount(v1 ^ v2);
} 

//Output lower part of term in console  /  Unterer Teil des Terms in der Konsole ausgeben
void lowerTerm(int bitfield, int mask, int num) {
	if (mask) {
		for (int z = num - 1; z >= 0; z--) {
			if (mask & (1 << z)) {
				printf("%c", 'A' + (num - 1) - z);
				if(bitfield & (1 << z))
					printf("]");
			}
		} 
	}
}
//Determines whether "value" contains "part"  /  Bestimmt, ob "value" "part" beinhaltet
int contains(value, mask, part, partmask) {
	if ((value & partmask) == (part & partmask)) {
		if ((mask & partmask) ==  partmask)
			return TRUE;
	}   
	return FALSE;
}

int main() {
	for(int d = 0; d <= 0xff; d++) {
		int num = 0; // Number of Variables  /  Anzahl Eingänge
		int pos = 0;
		int cur = 0;
		int reduction = 0; //reduction step  / Reduktionsschritt
		int maderedction = FALSE;
		int prim_count = 0;
		int term = 0;
		int termmask = 0;
		int found = 0;
		int x = 0;
		int y = 0;
		int z = 0;
		int count = 0;
		int lastprim = 0;
		int res = 0; // actual result  /  Ist-Ausgabe

		// Fill all arrays with default values / Alle Arrays mit Standardwert auffüllen
		for(x = 0; x < MAX; x++) {
			primmask[x] = 0;
			prim[x] = 0;
			wprim[x] = FALSE;
			nwprim[x] = FALSE;
			result[x] = FALSE;
			nwprim[x] = TRUE; //unwesentliche Primimplikaten als benötigt markieren
			for(y = 0; y < MAX; y++) {
				mask[x][y] = 0;
				minterm[x][y] = 0;
				used[x][y] = FALSE;
			}
		}

		num = 3;
		pos = (1 << num);  // 2 ^ num

		cur = 0;
		for(x = 0; x < pos; x++) {
			int value = d & (1 << (7 - x));
			if(value) {
				mask[cur][0] = ((1 << num) - 1);
				minterm[cur][0] = x;
				cur++;
				result[x] = 1;
			}
		}

		for(reduction = 0; reduction < MAX; reduction++) {
			cur = 0;
			maderedction = FALSE;
			for(y = 0; y < MAX; y++) {
				for(x = 0; x < MAX; x++) {
					if((mask[x][reduction]) && (mask[y][reduction])) {
						if(popCount(mask[x][reduction]) > 1) { // Do not allow complete removal (problem if all terms are 1)  /  Komplette aufhebung nicht zulassen (sonst problem, wenn alle Terme = 1)
							if((hammingWeight(minterm[x][reduction] & mask[x][reduction], minterm[y][reduction] & mask[y][reduction]) == 1) && (mask[x][reduction] == mask[y][reduction])) { // Simplification only possible if 1 bit differs  /  Vereinfachung nur möglich, wenn 1 anderst ist 
								term = minterm[x][reduction]; // could be mintern x or y /  egal ob mintern x oder minterm y 
								//e.g.:
								//1110
								//1111
								//Should result in mask of 1110  /  Soll Maske von 1110 ergeben
								termmask = mask[x][reduction] ^ (minterm[x][reduction] ^ minterm[y][reduction]);
								term &= termmask;

								found = FALSE;
								for(z = 0; z < cur; z++) {
									if((minterm[z][reduction + 1] == term) && (mask[z][reduction + 1] == termmask)) {
										found = TRUE;
									}
								}

								if(found == FALSE) {
									minterm[cur][reduction + 1] = term;
									mask[cur][reduction + 1] = termmask;
									cur++;
								}
								used[x][reduction] = TRUE;
								used[y][reduction] = TRUE;
								maderedction = TRUE;
							}
						}
					}
				}
			}
			if(maderedction == FALSE)
				break; //exit loop early (speed optimisation)  /  Vorzeitig abbrechen (Geschwindigkeitsoptimierung)
		}

		prim_count = 0;
		//printf("\nprime implicants:\n");
		for(reduction = 0; reduction < MAX; reduction++) {
			for(x = 0; x < MAX; x++) {
				//Determine all not used minterms  /  Alle nicht verwendeten Minterme bestimmen
				if((used[x][reduction] == FALSE) && (mask[x][reduction])) {
					//Check if the same prime implicant is already in the list  /  Überprüfen, ob gleicher Primimplikant bereits in der Liste
					found = FALSE;
					for(z = 0; z < prim_count; z++) {
						if(((prim[z] & primmask[z]) == (minterm[x][reduction] & mask[x][reduction])) && (primmask[z] == mask[x][reduction]))
							found = TRUE;
					}
					if(found == FALSE) {
						//outputTerm(minterm[x][reduction], mask[x][reduction], num);
						//printf("\n");
						primmask[prim_count] = mask[x][reduction];
						prim[prim_count] = minterm[x][reduction];
						prim_count++;
					}
				}
			}
		}

		//find essential and not essential prime implicants  /  wesentliche und unwesentliche Primimplikanten finden
		//all alle prime implicants are set to "not essential" so far  /  Primimplikanten sind bisher auf "nicht wesentlich" gesetzt
		for(y = 0; y < pos; y++) { //for all minterms  /  alle Minterme durchgehen 	
			count = 0;
			lastprim = 0;
			if(mask[y][0]) {
				for(x = 0; x < prim_count; x++) { //for all prime implicants  /  alle Primimplikanten durchgehen  
					if(primmask[x]) {
						// Check if the minterm contains prime implicant  /  the Überprüfen, ob der Minterm den Primimplikanten beinhaltet
						if(contains(minterm[y][0], mask[y][0], prim[x], primmask[x])) {
							count++;
							lastprim = x;
						}
					}
				}
				// If count = 1 then it is a essential prime implicant /  Wenn Anzahl = 1, dann wesentlicher Primimplikant
				if(count == 1) {
					wprim[lastprim] = TRUE;
				}
			}
		}

		// successively testing if it is possible to remove prime implicants from the rest matrix  /  Nacheinander testen, ob es mögich ist, Primimplikaten der Restmatrix zu entfernen
		for(z = 0; z < prim_count; z++) {
			if(primmask[z]) {
				if((wprim[z] == FALSE)) { // && (rwprim[z] == TRUE))
					nwprim[z] = FALSE; // mark as "not essential" /  als "nicht benötigt" markiert
					for(y = 0; y < pos; y++) { // for all possibilities  /  alle Möglichkeiten durchgehen 
						res = 0;
						for(x = 0; x < prim_count; x++) {
							if((wprim[x] == TRUE) || (nwprim[x] == TRUE)) {  //essential prime implicant or marked as required  /  wesentlicher Primimplikant oder als benötigt markiert
								if((y & primmask[x]) == (prim[x] & primmask[x])) { //All bits must be 1  /  Es müssen alle Bits auf einmal auf 1 sein (da And-Verknüpfung)
									res = 1;
									break;
								}
							}
						}
						//printf(" %d\t%d\n", result, result[y]);
						if(res == result[y]) {  // compare calculated result with input value /  Berechnetes ergebnis mit sollwert vergleichen				
							//printf("not needed\n"); //prime implicant not required  /  Primimplikant wird nicht benötigt
						} else {
							//printf("needed\n");
							nwprim[z] = TRUE; //prime implicant required  /  Primimplikant wird doch benötigt
						}
					}
				}
			}
		}
		count = 0;
		printf("\t0x%02x: '", d);
		for(x = 0; x < prim_count; x++) {
			if(wprim[x] == TRUE) {
				if(count > 0) printf("|");
				lowerTerm(prim[x], primmask[x], num);
				count++;
			} else if((wprim[x] == FALSE) && (nwprim[x] == TRUE)) {
				if(count > 0) printf("|");
				lowerTerm(prim[x], primmask[x], num);
				count++;
			}
		}
		printf("',\n");
	}
	return 0;
}

