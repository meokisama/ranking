const publisherFilter = [
    {
        text: 'IPM',
        value: 'IPM',
    },
    {
        text: 'Thái Hà Books',
        value: 'Thái Hà Books',
    },
    {
        text: 'Quảng Văn',
        value: 'Quảng Văn',
    },
    {
        text: 'Amak',
        value: 'Amak',
    },
    {
        text: 'Sky Light Novel',
        value: 'Sky Light Novel',
    },
    {
        text: 'Tsuki Light Novel',
        value: 'Tsuki Light Novel',
    },
    {
        text: 'Nhã Nam',
        value: 'Nhã Nam',
    },
    {
        text: 'Owlbooks',
        value: 'Owlbooks',
    },
    {
        text: 'Kim Đồng',
        value: 'Kim Đồng',
    },
    {
        text: 'NXB Trẻ',
        value: 'NXB Trẻ',
    },
    {
        text: 'TA Books',
        value: 'TA Books',
    },
    {
        text: 'Ai Novel',
        value: 'Ai Novel',
    },
    {
        text: 'Uranix',
        value: 'Uranix',
    },
    {
        text: 'Shine Novel',
        value: 'Shine Novel',
    },
    {
        text: 'Usagi Light Novel',
        value: 'Usagi Light Novel',
    },
    {
        text: 'Ichi Light Novel',
        value: 'Ichi Light Novel',
    },
    {
        text: 'Orion Books',
        value: 'Orion Books',
    },
];

// Handle list from API
const handleList = (arr) => {
    arr.sort((a, b) => b.count - a.count);

    let rank = 1;
    let prevVote = arr[0].count;
    arr.forEach((item, index) => {
        if (item.count < prevVote) {
            rank++;
            prevVote = item.count;
        }
        item.rank = rank;
    });

    const finalList = arr.map((ln, index) => {
        return { ...ln, key: `${index + 1}` };
    });

    return finalList;
};

const addZeroCount = (data) => {
    return data.map((item) => ({
        ...item,
        count: 0,
    }));
};

export { publisherFilter, handleList, addZeroCount };
