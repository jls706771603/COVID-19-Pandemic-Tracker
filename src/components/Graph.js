import { ref, push, getDatabase, get, child } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js';
import './Graph.css'


export default function Graph() {
    const [allTwoWeekStateData, setAllTwoWeekStateData] = useState([])

    const [dropDownValue, setDropDownValue] = useState("[Enter State]")
    const [dropDownValue2, setDropDownValue2] = useState("[Field]")

    const [dateList, setDateList] = useState([])
    const [dataList, setDataList] = useState([])

    const [dataList2, setDataList2] = useState([])

    const [colorChange, setColorChange] = useState("")
    const [useColor, setUseColor] = useState("")

    const [usePercent, setUsePercent] = useState();

    const [classChange, setClassChange] = useState("")
    const [currentClass, setCurrentClass] = useState("");

    var index = 0;

    const dbRef = ref(getDatabase())

    useEffect(() => {
        get(child(dbRef, `All 2 Week Data`)).then((snapshot => {
            if (snapshot.exists()) {
                setAllTwoWeekStateData(snapshot.val())
            } else {
                console.log("No data!")
            }
        }))
    }, [])

    useEffect(() => {
        setColorChange(["rgb(252, 170, 70)", "rgb(255, 55, 55)", "rgb(59, 213, 59)"])
    }, [])

    useEffect(() => {
        setClassChange(["graphvalue", "graphvalue2", "graphvalue3"])
    }, [])

    useEffect(() => {
        changeGraph()
    }, [dropDownValue])

    useEffect(() => {
        changeGraph()
    }, [dropDownValue2])

    useEffect(() => {

    }, [usePercent])

    async function changeState(input) {
        console.log("Input: " + input);
        setDropDownValue(input);
        changeGraph()
    }

    async function changeFields(input) {
        console.log("Input2: " + input);
        setDropDownValue2(input);
        changeGraph()
    }

    async function changeGraph() {
        console.log("changeGraph()")
        console.log(dropDownValue2)
        var inputData = [];
        var dateList = [];
        var holder = [];
        holder = allTwoWeekStateData;

        var previous = 0;
        var hasRun = false;

        if (dropDownValue2 == 'Cases') {
            setUsePercent(false)
            setCurrentClass(0)
            holder.forEach(function (entry) {
                if (index == 14) {
                    return true;
                }
                if (!hasRun) {
                    previous = entry.cases
                    dateList[index] = entry.date;
                    hasRun = true;
                }
                else if (dropDownValue == entry.name) {
                    var cases = entry.cases;
                    var date = entry.date;
                    console.log(cases + " - " + previous)
                    console.log(date)
                    inputData[index] = cases - previous;
                    if (index != 13) {
                        dateList[index + 1] = date;
                    }
                    previous = cases
                    index++;
                }
            });
            setUseColor(colorChange[0]);
        }
        else if (dropDownValue2 == 'Deaths') {
            setUsePercent(false)
            setCurrentClass(1)
            holder.forEach(function (entry) {
                if (index == 14) {
                    return true;
                }
                if (!hasRun) {
                    previous = entry.deaths
                    dateList[index] = entry.date;
                    hasRun = true;
                }
                else if (dropDownValue == entry.name) {
                    var deaths = entry.deaths;
                    var date = entry.date;
                    console.log(deaths)
                    console.log(date)
                    inputData[index] = deaths - previous;
                    if (index != 13) {
                        dateList[index + 1] = date;
                    }
                    previous = deaths
                    index++;
                }
            });
            setUseColor(colorChange[1]);
        }
        else if (dropDownValue2 == "Vaccinations") {
            setUsePercent(true)
            setCurrentClass(2)
            holder.forEach(function (entry) {
                if (dropDownValue == entry.name) {
                    var vacRate = entry.vacRate;
                    var date = entry.date;
                    console.log(vacRate)
                    console.log(date)
                    inputData[index] = vacRate;
                    dateList[index] = date;
                    index++;
                }
            });
            setUseColor(colorChange[2]);
        }
        let sum = 0;
        let counter = 0;
        inputData.forEach((num) => { sum += num; counter++; })
        sum = round(sum / counter, 0);
        let highest = Math.max(...inputData);
        let lowest = Math.min(...inputData);

        console.log("sum: " + sum)
        console.log("max: " + highest)
        console.log("min: " + lowest)

        setDataList2([highest, sum, lowest])
        console.log(dataList2)

        console.log(dateList)
        console.log(inputData)
        setDateList(dateList)
        setDataList(inputData)
        console.log("putting values in array")
    }

    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    };

    return (
        <div className='graphBackground'>
            <form>
                <div className='allSelections'>
                    <div className='selectContainer'>
                        <label for="queryState" className="queryLabel2">Enter State: </label>
                        <select name="queryState" id="searchState" className="selectOption2" onChange={(e) => changeState(e.target.value)}>
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
                    <div className='selectContainer'>
                        <label for="queryFields" className="queryLabel2">Options: </label>
                        <select name="queryFields" className="selectOption2" onChange={(e) => changeFields(e.target.value)}>
                            <option disabled selected value> -- Select Fields -- </option>
                            <option>Cases</option>
                            <option>Deaths</option>
                            <option>Vaccinations</option>
                        </select>
                        <div className='selectUnderline'></div>
                    </div>
                </div>
            </form>
            <Plot
                data={[
                    {
                        x: dateList,
                        y: dataList,
                        type: 'scatter',
                        marker: {
                            color: useColor
                        },
                        hoverlabel: {
                            font: {
                                family: 'Segoe UI',
                                color: 'white',
                                size: 18
                            },
                            bordercolor: 'rgb(239, 239, 239)'
                        }
                    }
                ]}
                layout={{ width: 1000, height: 500, title: 'Last 2 Weeks of Covid-19 ' + dropDownValue2, titlefont: { size: 30 }, xaxis: { fixedrange: true, title: "Dates", titlefont: { size: 20 } }, yaxis: { fixedrange: true, title: dropDownValue2, titlefont: { size: 20 } }, plot_bgcolor: 'rgb(249, 249, 249)', paper_bgcolor: 'rgb(249, 249, 249)' }}
                config={{ displayModeBar: false }}
            />
            <div className='graphStats'>
                <div className='graphAndData'>
                    <article className="graphprofile">
                        <span className="graphname">Highest {dropDownValue2}</span>
                        <span className={classChange[currentClass]}>{dataList2[0]}{usePercent ? "%" : ""}</span>
                    </article>
                    <article className="graphprofile">
                        <span className="graphname">Average {dropDownValue2}</span>
                        <span className={classChange[currentClass]}>{dataList2[1]}{usePercent ? "%" : ""}</span>
                    </article>
                    <article className="graphprofile">
                        <span className="graphname">Lowest {dropDownValue2}</span>
                        <span className={classChange[currentClass]}>{dataList2[2]}{usePercent ? "%" : ""}</span>
                    </article>
                </div>
            </div>
        </div>
    )

}