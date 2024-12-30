import {
  SELECTABLE_CATEGORIES,
  PERIOD_CATEGORIES,
  CURRENT_PERIOD,
} from "@/constants";

const publisherFilter = [
  {
    text: "IPM",
    value: "IPM",
  },
  {
    text: "Thái Hà Books",
    value: "Thái Hà Books",
  },
  {
    text: "Quảng Văn",
    value: "Quảng Văn",
  },
  {
    text: "Amak",
    value: "Amak",
  },
  {
    text: "Sky Light Novel",
    value: "Sky Light Novel",
  },
  {
    text: "Tsuki Light Novel",
    value: "Tsuki Light Novel",
  },
  {
    text: "Nhã Nam",
    value: "Nhã Nam",
  },
  {
    text: "Owlbooks",
    value: "Owlbooks",
  },
  {
    text: "Kim Đồng",
    value: "Kim Đồng",
  },
  {
    text: "NXB Trẻ",
    value: "NXB Trẻ",
  },
  {
    text: "TA Books",
    value: "TA Books",
  },
  {
    text: "Ai Novel",
    value: "Ai Novel",
  },
  {
    text: "Uranix",
    value: "Uranix",
  },
  {
    text: "Shine Novel",
    value: "Shine Novel",
  },
  {
    text: "Usagi Light Novel",
    value: "Usagi Light Novel",
  },
  {
    text: "Ichi Light Novel",
    value: "Ichi Light Novel",
  },
  {
    text: "Orion Books",
    value: "Orion Books",
  },
];

// Handle list from API
const handleList = (arr) => {
  arr.sort((a, b) => b.count - a.count);

  let rank = 1;
  let prevVote = arr[0].count;
  arr.forEach((item, index) => {
    if (item.count < prevVote) {
      // Rank order: 1 - 1 - 2
      // rank++;

      // Rank order: 1 - 1 - 3
      rank = index + 1;
      prevVote = item.count;
    }
    item.rank = rank;
  });

  const finalList = arr.map((ln, index) => {
    return { ...ln, key: index + 1 };
  });

  return finalList;
};

const addZeroCount = (data) => {
  return data.map((item) => ({
    ...item,
    count: 0,
  }));
};

// Change format of JSON to fit with antd table
const mergeAttribute = (array, attribute) => {
  return array.map((item) => {
    const { [attribute]: attr, ...rest } = item;
    return { ...rest, ...attr };
  });
};
// Utility function to filter categories based on selected year
const filterCategories = (selectedValues) => {
  return SELECTABLE_CATEGORIES.filter((item) =>
    selectedValues.includes(item.value)
  );
};
// Filter unvoted ranobe
function filterByIds(data, ids) {
  return data.filter((item) => ids.includes(item.id));
}

const initialChosenItems = () => {
  const periodCategories = PERIOD_CATEGORIES[CURRENT_PERIOD];
  const initial = periodCategories.map((categoryShort) => {
    const categoryInfo = SELECTABLE_CATEGORIES.find(
      (cat) => cat.value === categoryShort
    );

    return {
      category_name: categoryInfo.label,
      category_short: categoryShort,
      chosenItems: [],
    };
  });

  initial.push({
    category_name: "Chia sẻ ý kiến và đề xuất",
    category_short: "feedback",
    chosenItems: [],
  });

  return initial;
};

export {
  publisherFilter,
  handleList,
  addZeroCount,
  mergeAttribute,
  filterCategories,
  filterByIds,
  initialChosenItems,
};
