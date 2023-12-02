import React, { useEffect, useState } from "react";

export const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  let selectedRows = [];
  let isSelectAllChecked = false;
 console.log(data)
  return (
    <div className="w-full my-10">
      <input type="search" />
      <table className="p-2 text-left max-w-6xl mx-auto table-auto w-full border-collapse border border-slate-400">
        <thead>
          <tr className="[&>th]:border-r [&>th]:border-slate-400 [&>th]:py-1 [&>th]:px-2">
            <th className="text-center">
              <input
                type="checkbox"
                id="main-checkbox"
                checked={isSelectAllChecked}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr className="[&>td]:border-r [&>td]:border-slate-400 [&>td]:py-1 [&>td]:px-2">
              <td id={"checkbox-" + item.id} className="text-center">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item.id)}
                />
              </td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.role}</td>
              <td className="flex gap-4">
                <button className=" p-1 border"> Edit</button>
                <button className=" p-1 border">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
