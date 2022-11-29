volatile int counter;
extern void e(int);
__attribute__((interrupt)) void interruptHandler() {
	e(counter);
}