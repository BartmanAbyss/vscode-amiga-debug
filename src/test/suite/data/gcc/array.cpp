static const unsigned char table[] = { 10, 20, 30, 40, 50, 60, 70, 80 };

template <typename T>
inline T IndexW(const T* table, short offset) {
    unsigned char ret;
    if constexpr(sizeof(T) == 1)
        asm("move.b (%1,%2.w),%0":"=d"(ret):"a"(table),"d"(offset));
    else if constexpr(sizeof(T) == 2)
        asm("move.w (%1,%2.w),%0":"=d"(ret):"a"(table),"d"(offset));
    else if constexpr(sizeof(T) == 4)
        asm("move.l (%1,%2.w),%0":"=d"(ret):"a"(table),"d"(offset));
    return ret;
}

unsigned char xxx(short offset) {
    //return *(table + offset);
    return table[offset];
}

unsigned char xxx2(short offset) {
    return *(table + offset);
}

unsigned char xxx3(short offset) {
    return IndexW(table, offset);
}
