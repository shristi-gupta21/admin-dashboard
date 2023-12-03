import React, { useEffect, useState } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

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
  const pageSize = 10;
  const [data, setData] = useState([]);
  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(false);
  const [checkboxCheckedIndexArray, setCheckboxCheckedIndexArray] = useState(
    []
  );
  const [checkboxCheckedIndex, setCheckboxCheckedIndex] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const handleMasterCheckboxChange = () => {
    setMasterCheckboxChecked(!masterCheckboxChecked);
  };

  const handleCheckboxChange = (index, isChecked, id) => {
    const checkboxStates = Array(46).fill(masterCheckboxChecked);
    checkboxStates[index] = isChecked;
    setCheckboxCheckedIndexArray((prev) => [...prev, id]);
    setCheckboxCheckedIndex(id)
  };

  const clickMasterDelete = () => {
    let newDataArray = data.filter(
      (item) => !checkboxCheckedIndexArray.includes(item.id)
    );
    setData(newDataArray);
  };
  const clickDelete = () => {
    let newDataArray = data.filter(item => item.id !== checkboxCheckedIndex);
    setData(newDataArray);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      setFilteredData(data);
    } else {
      const filteredResults = data.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(e.target.value)
        )
      );
      setFilteredData(filteredResults);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const totalPages = Math.ceil(data.length / pageSize);
  const pagesArr =[];
  for(let i=1; i <= totalPages;i++ ){
    pagesArr.push(i);
  }
  const renderTableRows = () => {
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    return data.slice(startIdx, endIdx).map((item, index) => (
      <tr key={item.id} className="[&>td]:border-r [&>td]:border-slate-400 [&>td]:py-1 [&>td]:px-2">
        <td  id={"checkbox-" + item.id} className="text-center">
          {masterCheckboxChecked ? (
            <input
              type="checkbox"
              checked={masterCheckboxChecked}
              onChange={(e) =>
                handleCheckboxChange(index, e.target.checked, item.id)
              }
            />
          ) : (
            <input
              type="checkbox"
              onChange={(e) =>
                handleCheckboxChange(index, e.target.checked, item.id)
              }
            />
          )}
        </td>
        <td>{item.id}</td>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.role}</td>
        <td className="flex gap-4">
          <button className="p-1 hover:bg-slate-200 rounded hover:text-slate-700">
            <ModeEditIcon />
          </button>
          <button
            onClick={clickDelete}
            className="p-1 hover:bg-slate-200 rounded hover:text-slate-700"
          >
            <DeleteOutlineIcon />
          </button>
        </td>
      </tr>
    ));
  };
  return (
    <div className="w-full my-10  max-w-6xl mx-auto px-4 md:px-0">
      <div className="flex justify-between">
        <div>
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearch}
            className="border rounded py-2 px-4"
            placeholder="Search by id"
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSearch}
            className="search-icon border py-2 px-2 rounded"
          >
            <SearchIcon />
          </button>
        </div>
        <button
          onClick={clickMasterDelete}
          className="text-red-500 border py-1 px-2 rounded hover:bg-slate-200"
        >
          <DeleteIcon />
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="p-2 mt-4 text-left table-auto w-full border-collapse border border-slate-400">
          <thead>
            <tr className="[&>th]:border-r [&>th]:border-slate-400 [&>th]:py-1 [&>th]:px-2 border-b border-slate-400">
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
              ? renderTableRows()
              : filteredData.map((item, index) => (
                  <tr key={item.id} className="[&>td]:border-r [&>td]:border-slate-400 [&>td]:py-1 [&>td]:px-2">
                    <td id={"checkbox-" + item.id} className="text-center">
                      {masterCheckboxChecked ? (
                        <input
                          type="checkbox"
                          checked={masterCheckboxChecked}
                          onChange={(e) =>
                            handleCheckboxChange(
                              index,
                              e.target.checked,
                              item.id
                            )
                          }
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={checkboxCheckedIndexArray}
                          onChange={(e) =>
                            handleCheckboxChange(
                              index,
                              e.target.checked,
                              item.id
                            )
                          }
                        />
                      )}
                    </td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td className="flex gap-4">
                      <button className=" p-1 border">
                        <ModeEditIcon />
                      </button>
                      <button onClick={clickDelete} className=" p-1 border">
                        <DeleteOutlineIcon />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <div className="pt-4 flex w-full justify-between">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          className="border text-sm md:text-base px-2 md:px-4 py-1 rounded bg-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div>
          {pagesArr.map((page) => (
            <button
              key={page}
              className=" mx-0.5 md:mx-1 text-xs md:text-sm scale-110 disabled:text-base disabled:scale-100 h-5 w-5 md:h-8 md:w-8 rounded-full bg-blue-300 disabled:bg-yellow-200 disabled:text-gray-600 font-medium"
              onClick={() => setCurrentPage(page)}
              disabled={currentPage === page}
            >
              {page}
            </button>
          ))}
        </div>
        <span className="text-sm md:text-base">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className="border text-sm md:text-base px-2 md:px-4 py-1 rounded bg-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};
