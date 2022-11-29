volatile int counter;
extern void e(int);
void interruptHandler() {
	e(counter);
}