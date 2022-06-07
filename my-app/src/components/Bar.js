import './Bar.css'
import React, { Component, useState, useEffect } from 'react';
import db from './firebase.config';
import { ref, push, getDatabase, get, child } from 'firebase/database'
import Plot from 'react-plotly.js';

export default function Bar() {
    const dbRef = ref(getDatabase())

    const [twoWeekStateData, setTwoWeekStateData] = useState([])
    const [threeMonthsStateData, setThreeMonthsStateData] = useState([])
    const [sixMonthsStateData, setSixMonthsStateData] = useState([])

    const [stateList, setStateList] = useState([])
    const [dataList, setDataList] = useState([])

    const [dropDownValue, setDropDownValue] = useState("[Time Interval]")
    const [dropDownValue2, setDropDownValue2] = useState("[Field]")

    const [colorChange, setColorChange] = useState("")
    const [useColor, setUseColor] = useState("")

    var timePeriod = "Last 2 Weeks";
    var index = 0;

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
        setColorChange(["rgb(252, 170, 70)", "rgb(255, 55, 55)", "rgb(59, 213, 59)"])
    }, [])

    useEffect(() => {
        changeBar()
    }, [dropDownValue])

    useEffect(() => {
        changeBar()
    }, [dropDownValue2])

    useEffect(() => {

    }, [useColor])

    async function changeTime(input) {
        console.log("Input: " + input);
        setDropDownValue(input);
        changeBar()
    }

    async function changeFields(input) {
        console.log("Input2: " + input);
        setDropDownValue2(input);

    }

    async function changeBar() {
        console.log("changeBar()")
        console.log(dropDownValue)
        console.log(dropDownValue2)
        var inputData = [];
        var stateData = [];
        var holder = [];
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

        if (dropDownValue2 == 'Cases') {
            holder.forEach(function (entry) {
                var cases = entry.cases;
                var name = entry.name;
                inputData[index] = cases;
                stateData[index] = name;
                index++;
            });
            setUseColor(colorChange[0]);
        }
        else if (dropDownValue2 == 'Deaths') {
            holder.forEach(function (entry) {
                var deaths = entry.deaths;
                var name = entry.name;
                inputData[index] = deaths;
                stateData[index] = name;
                index++;
            });
            setUseColor(colorChange[1]);
        }
        else if (dropDownValue2 == "Vaccinations") {
            holder.forEach(function (entry) {
                var vacRate = entry.vacRate;
                var name = entry.name;
                inputData[index] = vacRate;
                stateData[index] = name;
                index++;
            });
            setUseColor(colorChange[2]);
        }

        /*
        holder.forEach(function (entry) {
            //console.log(entry);
            var cases = entry.cases;
            var date = entry.date;
            var deaths = entry.deaths;
            var id = entry.id;
            var name = entry.name;
            var population = entry.population;
            var vacRate = entry.vacRate;

            inputData[index] = cases;
            stateData[index] = name;
            index++;
        });
        */

        console.log(stateData)
        console.log(inputData)
        setStateList(stateData)
        setDataList(inputData)
        console.log("putting values in array")
    }

    return (
        <div>
            <form>
                <div className='allSelections'>
                    <div className='selectContainer'>
                        <label for="queryTime2" className="queryLabel">Time Interval: </label>
                        <select name="queryTime2" className="selectOption" onChange={(e) => changeTime(e.target.value)}>
                            <option disabled selected value> -- Select Time Period -- </option>
                            <option>Last 2 Weeks</option>
                            <option>Last 3 Months</option>
                            <option>Last 6 Months</option>
                        </select>
                    </div>
                    <div className='selectContainer'>
                        <label for="queryFields" className="queryLabel">Options: </label>
                        <select name="queryFields" className="selectOption" onChange={(e) => changeFields(e.target.value)}>
                            <option disabled selected value> -- Select Fields -- </option>
                            <option>Cases</option>
                            <option>Deaths</option>
                            <option>Vaccinations</option>
                        </select>
                    </div>
                </div>
            </form>
            <Plot
                data={[
                    {
                        type: 'bar',
                        x: stateList,
                        y: dataList,
                        marker: {
                            color: useColor
                        },
                    },

                ]}
                layout={{ width: 1820, height: 500, title: dropDownValue + ' of Covid-19 ' + dropDownValue2, xaxis: { fixedrange: true, title: dropDownValue2 }, yaxis: { fixedrange: true, title: dropDownValue } }}
                config={{ displayModeBar: false }}
            />
        </div>
    )
}