typedef int BOOL;
typedef unsigned short u16;
#define TRUE 1
#define FALSE 0

enum ItemState
{
    eItemFall,
    eItemWait,
	eItemVanish,
};

typedef struct
{
    enum ItemState state;
    u16 stateTime;
}sItem;

BOOL processItemWait(sItem *b);


BOOL itemTick(sItem *b)
{
    auto oldState=b->state;
    switch(oldState)
    {
        case eItemWait:
		{
            BOOL isALive=processItemWait(b);

			if (isALive==FALSE) 
				return FALSE;
		}
        break;
    }

    if (b->state==oldState)
        b->stateTime++;

    return TRUE;
}