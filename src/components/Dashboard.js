import React, { useEffect, useState } from "react";

export const Dashboard = () => {
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
  const [data, setData] = useState([]);
  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMasterCheckboxChange = () => {
    setMasterCheckboxChecked(!masterCheckboxChecked);
  };

  const handleCheckboxChange = (index, isChecked) => {
    const checkboxStates = Array(46).fill(masterCheckboxChecked);
    checkboxStates[index] = isChecked;
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    if (e.target.value.trim() === '') {
      setFilteredData(data);
    } else {
      // Filter the data based on the search query
      const filteredResults = data.filter(
        (item) =>
          Object.values(item).some(
            (value) => typeof value === 'string' && value.toLowerCase().includes(e.target.value)
          )
      );
      setFilteredData(filteredResults);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <div className="w-full my-10  max-w-6xl mx-auto">
      <input
        type="search"
        value={searchQuery}
        onChange={handleSearch}
        className="border rounded py-2 px-4"
        placeholder="Search by id"
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSearch} className="search-icon">
        Search
      </button>
      <table className="p-2 mt-4 text-left table-auto w-full border-collapse border border-slate-400">
        <thead>
          <tr className="[&>th]:border-r [&>th]:border-slate-400 [&>th]:py-1 [&>th]:px-2">
            <th className="text-center">
              <input
                type="checkbox"
                id="main-checkbox"
                checked={masterCheckboxChecked}
                onChange={handleMasterCheckboxChange}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length < 1 
            ? data.map((item, index) => (
                <tr className="[&>td]:border-r [&>td]:border-slate-400 [&>td]:py-1 [&>td]:px-2">
                  <td id={"checkbox-" + item.id} className="text-center">
                    {masterCheckboxChecked ? (
                      <input
                        type="checkbox"
                        checked={masterCheckboxChecked}
                        onChange={(e) =>
                          handleCheckboxChange(index, e.target.checked)
                        }
                      />
                    ) : (
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleCheckboxChange(index, e.target.checked)
                        }
                      />
                    )}
                  </td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td className="flex gap-4">
                    <button className=" p-1 border"> Edit</button>
                    <button className=" p-1 border">Delete</button>
                  </td>
                </tr>
              ))
            : filteredData.map((item, index) => (
                <tr className="[&>td]:border-r [&>td]:border-slate-400 [&>td]:py-1 [&>td]:px-2">
                  <td id={"checkbox-" + item.id} className="text-center">
                    {masterCheckboxChecked ? (
                      <input
                        type="checkbox"
                        checked={masterCheckboxChecked}
                        onChange={(e) =>
                          handleCheckboxChange(index, e.target.checked)
                        }
                      />
                    ) : (
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleCheckboxChange(index, e.target.checked)
                        }
                      />
                    )}
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
