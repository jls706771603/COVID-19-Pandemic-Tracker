//import './Table.css'
import './Table.css'
import React, { Component, useState, useEffect } from 'react';
import db from './firebase.config';
import { ref, push, getDatabase, get, child } from 'firebase/database'

export default function Table() {
    /*
    const [stateDateList, setStateDateList] = useState([])
    const [graphData, setGraphData] = useState([])
    const [dateListSet, setDateListSet] = useState(false)
    */
    const dbRef = ref(getDatabase())

    /*
    let dateSnapshot = []
    let singleSnaps = []

    let displayData = []
    */

    const [twoWeekStateData, setTwoWeekStateData] = useState([])
    const [threeMonthsStateData, setThreeMonthsStateData] = useState([])
    const [sixMonthsStateData, setSixMonthsStateData] = useState([])

    const [dropDownValue, setDropDownValue] = useState("")
    var timePeriod = "";

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

    useEffect(() =>  {
        get(child(dbRef, `6 Month State Data/sixMonthData`)).then((snapshot => {
            if (snapshot.exists()) {
                setSixMonthsStateData(snapshot.val())
            } else {
                console.log("No data!")
            }
        }))
    }, [])

    /*
    async function timeSelected() {
        var input;

        input = document.getElementById("searchTime");
        input.addEventListener("change", () => {
            setDropDownValue(input.value)
        })
        await resetTable();
        await reloadTable();
    }
    */

    var table = document.getElementById('testBody');
    //console.log(table);
    var innerData = "";

    async function resetTable() {
        table.innerHTML = "";
    }

    async function reloadTable() {
        if (timePeriod !== dropDownValue) {

            var holder = [];
            console.log(dropDownValue);
            if (dropDownValue === "Last 2 Weeks") {
                holder = twoWeekStateData;
                timePeriod = "Last 2 Weeks"
            }
            else if (dropDownValue === "Last 3 Months") {
                holder = threeMonthsStateData;
                timePeriod = "Last 3 Months"
            }
            else if (dropDownValue === "Last 6 Months") {
                holder = sixMonthsStateData;
                timePeriod = "Last 6 Months"
            }

            holder.forEach(function (entry) {
                //console.log(entry);
                var cases = entry.cases;
                var date = entry.date;
                var deaths = entry.deaths;
                var id = entry.id;
                var name = entry.name;
                var population = entry.population;
                var vacRate = entry.vacRate;

                table.innerHTML += '<tr>' +
                    '<td>' + entry.name + '</td>' +
                    '<td>' + entry.date + '</td>' +
                    '<td>' + entry.cases + '</td>' +
                    '<td>' + entry.deaths + '</td>' +
                    '</tr>';

                innerData += '<tr>' +
                    '<td>' + entry.name + '</td>' +
                    '<td>' + entry.date + '</td>' +
                    '<td>' + entry.cases + '</td>' +
                    '<td>' + entry.deaths + '</td>' +
                    '</tr>';
            });
            table.innerHTML = innerData;

        }
    }

    /*var test = document.getElementById("searchState");
    test.addEventListener("change", myFunction);*/

    async function myFunction() {
        await resetTable();
        await reloadTable();
        var input, filter, table, tr, td, i;
        input = document.getElementById("searchState");
        console.log("Input: " + input)

        if (input.value.toUpperCase() == "ALL TIME") {
            console.log("ALL TIME")
        }

        input.addEventListener("change", () => {
            if (input.value.toUpperCase() == "ALL STATES") {
                table.innerHTML = innerData;
            }
            else {
                filter = input.value.toUpperCase();
                table = document.getElementById("testBody");
                tr = table.getElementsByTagName("tr");
                for (i = 0; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[0];
                    if (td) {
                        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    }
                }
            }
        })
    }

    return (
        <div>
            <form>
                <div className='allSelections'>
                    <div className='selectContainer'>
                        <label for="queryTime" className="queryLabel">Time Interval: </label>
                        <select name="queryTime" id="searchTime" className="selectOption" onChange={(e) => setDropDownValue(e.target.value)}>
                            <option>Last 2 Weeks</option>
                            <option>Last 3 Months</option>
                            <option>Last 6 Months</option>
                        </select>
                    </div>
                    <div className='selectContainer'>
                        <label for="queryState" className="queryLabel">Enter State: </label>
                        <select name="queryState" id="searchState" className="selectOption" onChange={myFunction()}>
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
                    </div>
                </div>
            </form>
            <table id="myTable" className='table'>
                <thead>
                    <tr>
                        <th>State</th>
                        <th>Date</th>
                        <th>Cases</th>
                        <th>Deaths</th>
                    </tr>
                </thead>
                <tbody id="testBody"></tbody>
            </table>
        </div>
    )
}