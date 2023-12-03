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
  const [bgColour, setBgColour] = useState("bg-white");
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;

  const handleMasterCheckboxChange = () => {
    const array = [];
    for (let i = startIdx; i <= endIdx; i++) {
      array.push(data[i].id);
    }
    if (array.length > 0) {
      setBgColour("bg-gray-200");
    } else {
      setBgColour("bg-white");
    }
    setCheckboxCheckedIndexArray(array);
    setMasterCheckboxChecked(!masterCheckboxChecked);
  };

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setMasterCheckboxChecked(false);
  };

  const handleCheckboxChange = (index, isChecked, id) => {
    const checkboxStates = Array(data.slice(startIdx, endIdx)).fill(
      masterCheckboxChecked
    );
    checkboxStates[index] = isChecked;
    if (isChecked) {
      setBgColour("bg-gray-200");
    } else {
      setBgColour("bg-white");
    }
    setCheckboxCheckedIndexArray((prev) => [...prev, id]);
    setCheckboxCheckedIndex(id);
  };

  const clickMasterDelete = () => {
    let newDataArray = data.filter(
      (item) => !checkboxCheckedIndexArray.includes(item.id)
    );
    setMasterCheckboxChecked(false);
    setData(newDataArray);
    if (filteredData.length > 0) {
      setFilteredData(newDataArray);
    }
  };
  const clickDelete = () => {
    let newDataArray = data.filter((item) => item.id !== checkboxCheckedIndex);
    setData(newDataArray);
    if (filteredData.length > 0) {
      setFilteredData(newDataArray);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      setFilteredData(data.slice(startIdx, endIdx));
    } else {
      const filteredResults = data
        .slice(startIdx, endIdx)
        .filter((item) =>
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
  const pagesArr = [];

  for (let i = 1; i <= totalPages; i++) {
    pagesArr.push(i);
  }
  let keysArray = [];
  if (data.length > 0) {
    keysArray = Object.getOwnPropertyNames(data[0]);
  }
//   console.log(checkboxCheckedIndexArray.map((id) =>
//   id === data[0].id ? bgColour : "bg-white"
// ))
  const renderTableRows = () => {
    return data.slice(startIdx, endIdx).map((item, index) => (
      <tr
        key={item.id}
        className={`${
          masterCheckboxChecked
            ? checkboxCheckedIndexArray.map((id) =>
                id === item.id ? bgColour : " bg-white "
              )
            : checkboxCheckedIndex === item.id
            ? bgColour
            : " bg-white "
        } [&>td]:border-r [&>td]:border-slate-400 [&>td]:py-1 [&>td]:px-2`}
      >
        <td className="text-center">
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
        <td className="text-center">{item.id}</td>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.role}</td>
        <td className="flex gap-4">
          <button className="edit p-1 hover:bg-slate-200 rounded hover:text-slate-700">
            <ModeEditIcon />
          </button>
          <button
            onClick={clickDelete}
            className="delete p-1 hover:bg-slate-200 rounded hover:text-slate-700"
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
            placeholder="Search"
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
          className="delete text-red-500 border py-1 px-2 rounded hover:bg-slate-200"
        >
          <DeleteIcon />
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="p-2 mt-4 text-left table-auto w-full border-collapse border border-slate-400">
          <thead>
            <tr className="capitalize [&>th]:border-r [&>th]:border-slate-400 [&>th]:py-1 [&>th]:px-2 border-b border-slate-400">
              <th className="text-center">
                <input
                  type="checkbox"
                  checked={masterCheckboxChecked}
                  onChange={handleMasterCheckboxChange}
                />
              </th>
              {keysArray.map((item) =>
                item === "id" ? (
                  <th key={item} className="text-center">
                    {item}
                  </th>
                ) : (
                  <th key={item}>{item}</th>
                )
              )}
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length < 1
              ? renderTableRows()
              : filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="[&>td]:border-r [&>td]:border-slate-400 [&>td]:py-1 [&>td]:px-2"
                  >
                    <td className="text-center">
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
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td className="flex gap-4">
                      <button className="edit p-1 border">
                        <ModeEditIcon />
                      </button>
                      <button
                        onClick={clickDelete}
                        className="delete p-1 border"
                      >
                        <DeleteOutlineIcon />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between md:hidden pt-4">
        <button
          onClick={() => onPageChange(1)}
          className="first-page border text-sm md:text-base px-2 md:px-4 py-1 rounded bg-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
        >
          First Page
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          className="last-page border text-sm md:text-base px-2 md:px-4 py-1 rounded bg-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
        >
          Last Page
        </button>
      </div>
      <div className="pt-4 flex w-full justify-between">
        <div className="md:flex gap-2 hidden">
          <button
            onClick={() => onPageChange(1)}
            className="first-page border text-sm md:text-base px-2 md:px-4 py-1 rounded bg-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
          >
            First Page
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            className="last-page border text-sm md:text-base px-2 md:px-4 py-1 rounded bg-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
          >
            Last Page
          </button>
        </div>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="previous-page border text-sm md:text-base px-2 md:px-4 py-1 rounded bg-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
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
          onClick={() => onPageChange(currentPage + 1)}
          className="next-page border text-sm md:text-base px-2 md:px-4 py-1 rounded bg-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};
