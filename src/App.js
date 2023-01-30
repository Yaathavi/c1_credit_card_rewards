/* Yaathavi Theevannan, Date: Jan 23, 2023
Capital One Technical Assessment Challenge Submission
Input: Asks user to select the store they shopped at and how much they spent
Output: outputs the total points gained and a list of their transactions in a table  */

import "./App.css";
import React, { useEffect, useState } from "react";

// rules in optimal order
const rules = [
  {
    merchants: {
      sportcheck: 7500,
      tim_hortons: 2500,
      subway: 2500,
    },
    points: 500,
  },
  {
    merchants: {
      sportcheck: 7500,
      tim_hortons: 2500,
    },
    points: 300,
  },
  {
    merchants: {
      sportcheck: 7500,
    },
    points: 200,
  },
  {
    merchants: {
      sportcheck: 2500,
      tim_hortons: 1000,
      subway: 1000,
    },
    points: 150,
  },
  {
    merchants: {
      sportcheck: 2000,
    },
    points: 75,
  },
  {
    merchants: {
      sportcheck: 2500,
      tim_hortons: 1000,
    },
    points: 75,
  },
];

// function that calculates the points
function calculatePoints(transactions) {
  const merchantSpending = {
    sportcheck: 0,
    tim_hortons: 0,
    subway: 0,
    other: 0,
  };

  //sums up transactions for the 3 stores
  for (const transaction of transactions) {
    if (transaction.merchant_code in merchantSpending) {
      merchantSpending[transaction.merchant_code] += transaction.amount_cents;
    } else {
      merchantSpending.other += transaction.amount_cents;
    }
  }

  let totalPoints = 0;

  // for loop that loops through the rules and subtracts amount from points once points have been applied
  for (const rule of rules) {
    const merchantApplicationCounts = [];
    for (const merchant in rule.merchants) {
      merchantApplicationCounts.push(
        Math.floor(merchantSpending[merchant] / rule.merchants[merchant])
      );
    }
    const ruleApplications = Math.min(...merchantApplicationCounts);
    totalPoints += ruleApplications * rule.points;
    for (const merchant in rule.merchants) {
      merchantSpending[merchant] -= ruleApplications * rule.merchants[merchant];
    }
  }

  // calculates left over amount
  const leftOverCents = Object.values(merchantSpending).reduce(
    (a, b) => a + b,
    0
  );

  //Rule 7 is applied here for the left over money
  totalPoints += Math.floor(leftOverCents / 100);

  return totalPoints;
}

function App() {
  const [selectedValue, setSelectedValue] = useState("sportcheck");
  const [amount, setAmount] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const merchantChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const amountInputChange = (event) => {
    setAmount(event.target.value);
  };

  const submitButtonClick = (event) => {
    event.preventDefault();
    setTransactions([
      ...transactions,
      { merchant_code: selectedValue, amount_cents: parseInt(amount) },
    ]);
  };

  useEffect(() => {
    setTotalPoints(calculatePoints(transactions));
  }, [transactions]);

  return (
    <div class="h-screen items-center flex flex-col p-8 relative">
      <div class="absolute left-4 top-4 h-32 w-32 ...">
        <a href="https://www.capitalone.ca/" target="_blank">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Capital_One_logo.svg/1200px-Capital_One_logo.svg.png"
            alt="new"
          />
        </a>
      </div>

      <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
        Capital One Rewards Calculator
      </h1>
      <p class="mb-6 text-lg font-normal text-blue-900 lg:text-xl sm:px-16 xl:px-48 ">
        Shop smarter with Capital One's new rewards points system - earn points
        on every purchase and redeem them for amazing rewards!
      </p>

      <div className="w-1/2 bg-gray-800  p-8 flex flex-col items-center border-gray-900 shadow-lg">
        <p className=" mb-4 text-white">
          Enter each transaction individually by choosing the store you shopped
          at and the amount spent in cents.
        </p>
        <div className="flex flex-row">
          <div className=" flex flex-row">
            <p className="m-4 text-white"> Store Name: </p>
            <select
              onChange={merchantChange}
              className="pr-8 pl-8 pt-2 pb-2 text-gray-500 bg-white border  shadow-sm outline-none appearance-none focus:border-indigo-600"
            >
              <option value="sportcheck">Sport Check</option>
              <option value="tim_hortons">Tim Hortons</option>
              <option value="subway">Subway</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex flex-row">
            <p className="m-4 text-white"> Purchase Amount: </p>

            <input
              className="  text-gray-900 text-sm text-center"
              for="grid-first-name"
              type="text"
              onChange={amountInputChange}
              placeholder="amount in cents"
            />
          </div>
          <button
            type="submit"
            onClick={submitButtonClick}
            className="text-white bg-transparent ml-8 font-semibold hover:bg-gray-900 hover:text-white py-2 px-8 border border-white hover:border-transparent rounded"
          >
            Submit
          </button>
        </div>

        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-8">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Merchant Code
              </th>
              <th scope="col" class="px-6 py-3">
                Amount (Cents)
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-800 whitespace-nowrap dark:text-white"
                >
                  {transaction.merchant_code}
                </td>
                <td class="px-6 py-4 font-medium text-gray-800 whitespace-nowrap dark:text-white">
                  {transaction.amount_cents}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-1/2 bg-gray-300  p-4 flex flex-col items-center border-gray-900 shadow-lg">
        <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2">
          Total Points: {totalPoints}
        </label>
      </div>

      <a
        href="https://www.capitalone.ca/credit-cards/compare/"
        target="_blank"
        class="mt-8 flex flex-col items-center rounded-md border-gray-200  md:flex-row p-4 hover:bg-gray-100"
      >
        <img
          src="https://www.capitalone.co.uk/images/c1/cards/master_cards.png"
          alt="new"
        />
        <div class="flex flex-col justify-between p-4 leading-normal">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
            Get your Capital One Credit Card Today.
          </h5>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"></p>
        </div>
      </a>
    </div>
  );
}

export default App;
