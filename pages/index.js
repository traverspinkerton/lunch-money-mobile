export default function Budget({ budgets }) {
  console.log(budgets);
  return (
    <div className="bg-yellow-300 p-8 font-bold text-gray-800">
      <h1 className="text-4xl mb-8">Budget</h1>
      {!budgets.length ? (
        <p>hmm something is wrong</p>
      ) : (
        <ul className="bg-yellow-100 p-4 rounded">
          {budgets.map((budget, index) => (
            <li className="mb-2" key={`${budget.category_id}_${String(index)}`}>
              {budget.category_name}:{" "}
              <span
                className={
                  budget.rawAmount > 0 ? "text-green-500" : "text-red-500"
                }
              >
                {budget.amount}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export async function getStaticProps() {
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${process.env.LM_TOKEN}`);

  const startDate = "2021-12-01";
  const endDate = "2021-12-31";

  const res = await fetch(
    `https://dev.lunchmoney.app/v1/budgets?start_date=${startDate}&end_date=${endDate}`,
    { headers }
  );
  const budgets = await res.json();

  if (true || !budgets || !budgets.length) {
    return {
      props: {
        budgets: [],
      },
    };
  }

  const mappedBudgets = budgets.map((budget) => {
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
      rawAmount,
      amount,
    };
  });
  return {
    props: {
      budgets: mappedBudgets,
    },
  };
}
