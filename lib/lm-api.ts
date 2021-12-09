export interface Budget {
  category_id: number;
  category_name: string;
  amount: string;
  spent: number;
  budgeted: number;
}

export interface Total {
  budgeted: number;
  spent: number;
}

export interface BudgetData {
  budgets: Budget[];
  total: Total | {};
}

export async function getBudgetsForMonth(): Promise<BudgetData> {
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${process.env.LM_TOKEN}`);

  const startDate = "2021-12-01";
  const endDate = "2021-12-31";

  const res = await fetch(
    `https://dev.lunchmoney.app/v1/budgets?start_date=${startDate}&end_date=${endDate}`,
    { headers }
  );
  const budgets = await res.json();

  if (!budgets || !budgets.length) {
    return {
      budgets: [],
      total: {},
    };
  }

  const mappedBudgets = budgets
    .map(
      (budget: {
        data: {
          [x: string]: { budget_amount: number; spending_to_base: number };
        };
        category_id: number;
        category_name: string;
      }) => {
        if (
          !budget.data ||
          !budget.data[startDate] ||
          !budget.data[startDate].budget_amount
        ) {
          return {
            category_id: budget.category_id,
            category_name: budget.category_name,
            amount: 0,
          };
        }
        const rawAmount =
          budget.data[startDate].budget_amount -
          budget.data[startDate].spending_to_base;
        const amount = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(rawAmount);
        return {
          category_id: budget.category_id,
          category_name: budget.category_name,
          // rawAmount,
          amount,
          spent: budget.data[startDate].spending_to_base,
          budgeted: budget.data[startDate].budget_amount,
        };
      }
    )
    .filter((budget: Budget) => !!budget.amount);

  const total = mappedBudgets.reduce(
    (budget: Budget, totalSoFar: Total) => {
      return {
        budgeted: totalSoFar.budgeted + budget.budgeted,
        spent: totalSoFar.spent + budget.spent,
      };
    },
    {
      budgeted: 0,
      spent: 0,
    }
  );

  return { budgets: mappedBudgets, total };
}
