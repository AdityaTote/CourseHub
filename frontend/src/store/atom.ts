import { atom } from 'recoil';

export const searchCourseAtom = atom({
    key: "searchCourseAtom",
    default: [],
})

export const balanceAtom = atom({
    key: "balanceAtom",
    default: {
        pendingAmount: 0,
        lockedAmount: 0,
    },
})

export const adminTransactionAtom = atom({
    key: "adminTransactionAtom",
    default:[],
})

export const userTransactionAtom = atom({
    key: "userTransactionAtom",
    default:[],
})