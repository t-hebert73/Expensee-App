const expenseGraphColours = {
  default: {
    backgroundColor: 'rgba(201, 203, 207, 0.2)',
    borderColor: 'rgb(201, 203, 207)',
  },
  total: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: 'rgb(117, 117, 117)',
  },
  additional: [
    {
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgb(255, 99, 132)',
    },
    {
      backgroundColor: 'rgba(255, 159, 64, 0.5)',
      borderColor: 'rgb(255, 159, 64)',
    },
    {
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgb(75, 192, 192)',
    },
    {
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
    },
    {
      backgroundColor: 'rgba(255, 205, 86, 0.5)',
      borderColor: 'rgb(255, 205, 86)',
    },
    {
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      borderColor: 'rgb(153, 102, 255)',
    },
    {
      backgroundColor: 'rgba(227, 61, 148, 0.5)',
      borderColor: 'rgb(239, 207, 227)',
    },
    {
      backgroundColor: 'rgba(255, 99, 71, 0.5)',
      borderColor: 'rgb(255, 99, 71)',
    },
    {
      backgroundColor: 'rgba(255, 0, 0, 0.5)',
      borderColor: 'rgb(255, 255, 255)',
    },
    {
      backgroundColor: 'rgba(255, 165, 0, 0.5)',
      borderColor: 'rgb(255, 165, 0)',
    },
    {
      backgroundColor: 'rgba(0, 0, 255, 0.5)',
      borderColor: 'rgb(0, 0, 255)',
    },
  ],
};

const frequenciesMap = [
  {
    name: 'Weekly',
    modifier: 52,
  },
  {
    name: 'Bi-weekly',
    modifier: 26,
  },
  {
    name: 'Monthly',
    modifier: 12,
  },
  {
    name: 'Bi-monthly',
    modifier: 24,
  },
  {
    name: 'Quarterly',
    modifier: 4,
  },
  {
    name: 'Yearly',
    modifier: 1,
  },
];

export { expenseGraphColours, frequenciesMap };
