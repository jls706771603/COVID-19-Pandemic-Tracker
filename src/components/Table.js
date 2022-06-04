//import './Table.css'
import './Table.css'
import React, { Component, useState, useEffect } from 'react';
import db from './firebase.config';
import { ref, push, getDatabase, get, child } from 'firebase/database'

export default function Table() {
    const dbRef = ref(getDatabase())

    const [twoWeekStateData, setTwoWeekStateData] = useState([])
    const [threeMonthsStateData, setThreeMonthsStateData] = useState([])
    const [sixMonthsStateData, setSixMonthsStateData] = useState([])

    const [dropDownValue, setDropDownValue] = useState("")
    const [dropDownValue2, setDropDownValue2] = useState("")

    const [tableDataList, setTableDataList] = useState([])

    useEffect(() => {
        get(child(dbRef, `2 Week State Data/twoWeekData`)).then((snapshot => {
            if (snapshot.exists()) {
                setTwoWeekStateData(snapshot.val())
            } else {
                console.log("No data!")
            }
        }))
    }, [])

    useEffect(() => {
        get(child(dbRef, `90 Day State Data/threeMonthData`)).then((snapshot => {
            if (snapshot.exists()) {
                setThreeMonthsStateData(snapshot.val())
            } else {
                console.log("No data!")
            }
        }))
    }, [])

    useEffect(() => {
        get(child(dbRef, `6 Month State Data/sixMonthData`)).then((snapshot => {
            if (snapshot.exists()) {
                setSixMonthsStateData(snapshot.val())
            } else {
                console.log("No data!")
            }
        }))
    }, [])

    useEffect(() => {
        if (dropDownValue == "") {
            setDropDownValue("Last 2 Weeks")
        }
        if (dropDownValue2) {
            setDropDownValue2("All States")
        }
    }, [])

    useEffect(() => {
        changeTable()
    }, [dropDownValue])

    useEffect(() => {
        changeTable()
    }, [dropDownValue2])

    async function changeTime(input) {
        console.log("Input: " + input);
        setDropDownValue(input);
        changeTable()
    }

    async function changeState(input) {
        console.log("Input2: " + input);
        setDropDownValue2(input);
        changeTable()
    }

    async function changeTable() {
        console.log("changeTable()")
        console.log(dropDownValue)
        console.log(dropDownValue2)
        var inputData = [];
        var holder = [];
        let index = 0;
        if (dropDownValue == "Last 2 Weeks") {
            holder = twoWeekStateData
        }
        else if (dropDownValue == "Last 3 Months") {
            holder = threeMonthsStateData
        }
        else if (dropDownValue == "Last 6 Months") {
            holder = sixMonthsStateData
        }
        if (dropDownValue2 != "All States") {
            holder.forEach(function (entry) {
                let object = { name: "", date: "", cases: 0, deaths: 0 }
                var name = entry.name;
                if (name == dropDownValue2) {
                    var date = entry.date;
                    var cases = entry.cases;
                    var deaths = entry.deaths;
                    object.name = name;
                    object.date = date;
                    object.cases = cases;
                    object.deaths = deaths;
                    inputData[index] = object;
                    index++;
                }
            });
        }
        else {
            holder.forEach(function (entry) {
                let object = { name: "", date: "", cases: 0, deaths: 0 }
                var name = entry.name;
                var date = entry.date;
                var cases = entry.cases;
                var deaths = entry.deaths;
                object.name = name;
                object.date = date;
                object.cases = cases;
                object.deaths = deaths;
                inputData[index] = object;
                index++;
            });
        }

        setTableDataList(inputData);
        console.log(tableDataList);
    }

    return (
        <div className='tableBackground'>
            <form>
                <div className='allSelections'>
                    <div className='selectContainer'>
                        <label for="queryTime" className="queryLabel2">Time Interval: </label>
                        <select name="queryTime" className="selectOption2" onChange={(e) => changeTime(e.target.value)}>
                            <option disabled selected value> -- Select Time Period -- </option>
                            <option>Last 2 Weeks</option>
                            <option>Last 3 Months</option>
                            <option>Last 6 Months</option>
                        </select>
                        <div className='selectUnderline'></div>
                    </div>
                    <div className='selectContainer'>
                        <label for="queryState" className="queryLabel2">Enter State: </label>
                        <select name="queryState" className="selectOption2" onChange={(e) => changeState(e.target.value)}>
                            <option disabled selected value> -- Select State -- </option>
                            <option>All States</option>
                            <option>Alabama</option>
                            <option>Alaska</option>
                            <option>American Samoa</option>
                            <option>Arizona</option>
                            <option>Arkansas</option>
                            <option>California</option>
                            <option>Colorado</option>
                            <option>Connecticut</option>
                            <option>Delaware</option>
                            <option>District of Columbia</option>
                            <option>Florida</option>
                            <option>Georgia</option>
                            <option>Guam</option>
                            <option>Hawaii</option>
                            <option>Idaho</option>
                            <option>Illinois</option>
                            <option>Indiana</option>
                            <option>Iowa</option>
                            <option>Kansas</option>
                            <option>Kentucky</option>
                            <option>Louisiana</option>
                            <option>Maine</option>
                            <option>Maryland</option>
                            <option>Massachusetts</option>
                            <option>Michigan</option>
                            <option>Minnesota</option>
                            <option>Mississippi</option>
                            <option>Missouri</option>
                            <option>Montana</option>
                            <option>Nebraska</option>
                            <option>Nevada</option>
                            <option>New Hampshire</option>
                            <option>New Jersey</option>
                            <option>New Mexico</option>
                            <option>New York</option>
                            <option>North Carolina</option>
                            <option>North Dakota</option>
                            <option>Northern Mariana Islands</option>
                            <option>Ohio</option>
                            <option>Oklahoma</option>
                            <option>Oregon</option>
                            <option>Pennsylvania</option>
                            <option>Puerto Rico</option>
                            <option>Rhode Island</option>
                            <option>South Carolina</option>
                            <option>South Dakota</option>
                            <option>Tennessee</option>
                            <option>Texas</option>
                            <option>Utah</option>
                            <option>Vermont</option>
                            <option>Virgin Islands</option>
                            <option>Virginia</option>
                            <option>Washington</option>
                            <option>West Virginia</option>
                            <option>Wisconsin</option>
                            <option>Wyoming</option>
                        </select>
                        <div className='selectUnderline'></div>
                    </div>
                </div>
            </form>
            <div class="tableContainer">
                <table id="myTable" className='table'>
                    <thead>
                        <tr>
                            <th>State</th>
                            <th>Date</th>
                            <th>Cases</th>
                            <th>Deaths</th>
                        </tr>
                    </thead>
                    <tbody id="testBody">
                        {tableDataList.map((info) => (
                            <tr>
                                <td>{info.name}</td>
                                <td>{info.date}</td>
                                <td>{info.cases}</td>
                                <td>{info.deaths}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    )
}