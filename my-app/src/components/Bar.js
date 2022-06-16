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

    const [extraDataList, setExtraDataList] = useState([])
    const [extraDataList2, setExtraDataList2] = useState([])

    const [dropDownValue, setDropDownValue] = useState("[Time Interval]")
    const [dropDownValue2, setDropDownValue2] = useState("[Field]")

    const [colorChange, setColorChange] = useState("")
    const [useColor, setUseColor] = useState("")

    const [classChange, setClassChange] = useState("")
    const [currentClass, setCurrentClass] = useState("");

    const [reloadBar, setReloadBar] = useState(true)

    //const [usePercent, setUsePercent] = useState();

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
        setDropDownValue('Last 2 Weeks')
        setDropDownValue2('Cases')
        setReloadBar(true)
        changeBar()
    }, [twoWeekStateData, threeMonthsStateData, sixMonthsStateData, reloadBar])

    useEffect(() => {
        setColorChange(["rgb(252, 170, 70)", "rgb(255, 55, 55)", "rgb(59, 213, 59)"])
    }, [])

    useEffect(() => {
        setClassChange(["barvalue", "barvalue2", "barvalue3"])
    }, [])

    useEffect(() => {

    }, [currentClass])

    useEffect(() => {
        changeBar()
    }, [dropDownValue])

    useEffect(() => {
        changeBar()
    }, [dropDownValue2])

    useEffect(() => {

    }, [useColor])

    /*
    useEffect(() => {

    }, [usePercent])
    */

    async function changeTime(input) {
        // console.log("Input: " + input);
        setDropDownValue(input);
        changeBar()
    }

    async function changeFields(input) {
        // console.log("Input2: " + input);
        setDropDownValue2(input);
        changeBar()
    }

    async function changeBar() {
        console.log("changeBar()")
        // console.log(dropDownValue)
        // console.log(dropDownValue2)
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

        var extraData = []
        var extraData2 = []
        let highestValue;
        let highestName;
        let lowestValue;
        let lowestName;

        if (dropDownValue2 == 'Cases') {
            //setUsePercent(false)
            setCurrentClass(0)
            holder.forEach(function (entry) {
                var cases = entry.cases;
                var name = entry.name;

                if (highestValue == null && lowestValue == null) {
                    highestValue = cases
                    lowestValue = cases
                    highestName = name
                    lowestName = name
                }

                if (highestValue < cases) {
                    highestValue = cases
                    highestName = name
                }
                if (lowestValue > cases) {
                    lowestValue = cases
                    lowestName = name
                }

                inputData[index] = cases;
                stateData[index] = name;
                index++;
            });
            setUseColor(colorChange[0]);
        }
        else if (dropDownValue2 == 'Deaths') {
            //setUsePercent(false)
            setCurrentClass(1)
            holder.forEach(function (entry) {
                var deaths = entry.deaths;
                var name = entry.name;

                if (highestValue == null && lowestValue == null) {
                    highestValue = deaths
                    lowestValue = deaths
                    highestName = name
                    lowestName = name
                }

                if (highestValue < deaths) {
                    highestValue = deaths
                    highestName = name
                }
                if (lowestValue > deaths) {
                    lowestValue = deaths
                    lowestName = name
                }

                inputData[index] = deaths;
                stateData[index] = name;
                index++;
            });

            setUseColor(colorChange[1]);
        }
        /*
        else if (dropDownValue2 == "Vaccinations") {
            //setUsePercent(true)
            setCurrentClass(2)
            holder.forEach(function (entry) {
                var vacRate = entry.vacRate;
                var name = entry.name;

                if (highestValue == null && lowestValue == null) {
                    highestValue = vacRate
                    lowestValue = vacRate
                    highestName = name
                    lowestName = name
                }

                if (highestValue < vacRate) {
                    highestValue = vacRate
                    highestName = name
                }
                if (lowestValue > vacRate) {
                    lowestValue = vacRate
                    lowestName = name
                }

                inputData[index] = vacRate;
                stateData[index] = name;
                index++;
            });
            setUseColor(colorChange[2]);
        }
        */

        extraData[0] = highestValue
        extraData[1] = lowestValue
        extraData2[0] = highestName
        extraData2[1] = lowestName
        setExtraDataList(extraData)
        setExtraDataList2(extraData2)

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

        // console.log(stateData)
        // console.log(inputData)
        setStateList(stateData)
        setDataList(inputData)
        console.log("putting values in array")
    }

    return (
        <div className='barBackground'>
            <form>
                <div className='allSelections'>
                    <div className='selectContainer'>
                        <label for="queryTime2" className="queryLabel">Time Interval: </label>
                        <select defaultValue={"Last 2 Weeks"} name="queryTime2" className="selectOption" onChange={(e) => changeTime(e.target.value)}>
                            <option disabled selected value> -- Select Time Period -- </option>
                            <option>Last 2 Weeks</option>
                            <option>Last 3 Months</option>
                            <option>Last 6 Months</option>
                        </select>
                        <div className='selectUnderline'></div>
                    </div>
                    <div className='selectContainer'>
                        <label for="queryFields" className="queryLabel">Options: </label>
                        <select defaultValue={"Cases"} name="queryFields" className="selectOption" onChange={(e) => changeFields(e.target.value)}>
                            <option disabled selected value> -- Select Fields -- </option>
                            <option>Cases</option>
                            <option>Deaths</option>
                        </select>
                        <div className='selectUnderline'></div>
                    </div>
                </div>
            </form>
            <Plot
                data={[
                    {
                        hovertemplate: 'State: %{x}<br>' + dropDownValue2 + ': %{y}<extra></extra>',
                        type: 'bar',
                        x: stateList,
                        y: dataList,
                        marker: {
                            color: useColor
                        },
                        hoverlabel: {
                            font: {
                                family: 'Segoe UI',
                                color: 'white',
                                size: 18
                            },
                            bordercolor: 'rgb(249, 249, 249)'
                        },
                    },
                ]}
                layout={{ width: 1720, height: 700, margin: 10, title: dropDownValue + ' of Covid-19 ' + dropDownValue2, titlefont: { size: 30 }, xaxis: { fixedrange: true, title: "States", automargin: true, titlefont: { size: 20 } }, yaxis: { fixedrange: true, title: dropDownValue2, titlefont: { size: 20 } }, plot_bgcolor: 'rgb(239, 239, 239)', paper_bgcolor: 'rgb(239, 239, 239)' }}
                config={{ displayModeBar: false }}
            />

            <div className='barStats'>
                <div className='barAndData'>
                    <article className="barprofile">
                        <span className="barname">Highest {dropDownValue2}</span>
                        <span className={classChange[currentClass]}>{extraDataList[0]}{/*usePercent ? "%" : ""*/}</span>
                        <span className="barname">State</span>
                        <span className={classChange[currentClass]}>{extraDataList2[0]}</span>
                    </article>
                    <article className="barprofile">
                        <span className="barname">Lowest {dropDownValue2}</span>
                        <span className={classChange[currentClass]}>{extraDataList[1]}{/*usePercent ? "%" : ""*/}</span>
                        <span className="barname">State</span>
                        <span className={classChange[currentClass]}>{extraDataList2[1]}</span>
                    </article>
                </div>
            </div>
        </div>
    )
}