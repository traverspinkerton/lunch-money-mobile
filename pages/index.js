import Head from "next/head";

export default function Budget({ budgets, total }) {
  return (
    <div className="bg-yellow-300 p-8 font-bold text-gray-800 max-w-lg mx-auto">
      <Head>
        <title>Budget</title>
        <link
          rel="apple-touch-icon"
          sizes="128x128"
          href="/apple-touch-icon.png"
        ></link>
      </Head>
      <h1 className="text-4xl font-black mb-4 text-yellow-600">Budget</h1>
      {/* <select className="rounded w-full mb-4">
        <option value={11}>December</option>
        {['Jan', 'Feb', 'March'].map(month => <option>)}
      </select> */}
      {!budgets.length ? (
        <p>hmm something is wrong</p>
      ) : (
        <ul>
          {budgets.map((budget, index) => (
            <li
              className="mb-2 p-2 rounded shadow-sm bg-yellow-100 flex justify-between"
              key={`${budget.category_id}_${String(index)}`}
            >
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
      {/* <p>Budgeted: {total.budgeted}</p>
      <p>Spent: {total.spent}</p>
      <p>
        {total.budgeted > total.spent
          ? `${total.spent - total.budgeted} over budget`
          : `${total.budgeted - total.spent} under budget`}
      </p> */}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  if (req.cookies.lm_secret !== process.env.SECRET) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
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
      props: {
        budgets: [],
      },
    };
  }

  const mappedBudgets = budgets
    .map((budget) => {
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
        spent: budget.data[startDate].spending_to_base,
        budgeted: budget.data[startDate].budget_amount,
      };
    })
    .filter((budget) => !!budget.amount);

  const total = mappedBudgets.reduce(
    (budget, totalSoFar) => {
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

  return {
    props: {
      budgets: mappedBudgets,
      total,
    },
  };
}
