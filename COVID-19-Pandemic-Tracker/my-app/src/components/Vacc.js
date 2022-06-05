import './Vacc.css'
import React, { Component, useState, useEffect } from 'react';
import db from './firebase.config';
import { ref, push, getDatabase, get, child } from 'firebase/database'
import Plot from 'react-plotly.js';

export default function Bar() {
    const dbRef = ref(getDatabase())

    const [stateListData, setStateListData] = useState([])
    const [vaccinationTotal, setVaccinationTotal] = useState([])
    const [dataList, setDataList] = useState([])

    const [dropDownValue, setDropDownValue] = useState("[Enter State]")

    useEffect(() => {
        get(child(dbRef, `states/stateList`)).then((snapshot => {
            if (snapshot.exists()) {
                setStateListData(snapshot.val())
            } else {
                console.log("No data!")
            }
        }))
    }, [])

    useEffect(() => {

    }, [vaccinationTotal])

    useEffect(() => {

    }, [dropDownValue])

    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    async function changePieState(input) {
        setDropDownValue(input)
        console.log(input)
        let holder = stateListData;
        let vaccList = [];

        if (input != 'All States') {
            holder.forEach(function (entry) {
                var name = entry.name;
                if (name == input) {
                    setVaccinationTotal([parseFloat(entry.fullyVacBoosterRate), parseFloat(entry.vacRate) - parseFloat(entry.fullyVacBoosterRate), parseFloat(entry.oneDoseRate) - parseFloat(entry.vacRate), 100 - parseFloat(entry.oneDoseRate)])
                    setDataList([parseFloat(entry.plusBooster18), parseFloat(entry.plusBooster65), parseFloat(entry.plusRate18), parseFloat(entry.plusRate65)])
                }
            });
        }
        else {
            let fullyVacBooster = 0.0;
            let fullyVac = 0.0;
            let firstVac = 0.0;
            let noVac = 0.0;

            let booster18 = 0.0;
            let booster65 = 0.0;
            let rate18 = 0.0;
            let rate65 = 0.0;

            let index = 0;
            let index2 = 0;
            holder.forEach(function (entry) {
                if (!(entry.fullyVacBoosterRate == null || entry.vacRate == null || entry.oneDoseRate == null)) {
                    fullyVacBooster += parseFloat(entry.fullyVacBoosterRate)
                    fullyVac += parseFloat(entry.vacRate) - parseFloat(entry.fullyVacBoosterRate)
                    firstVac += parseFloat(entry.oneDoseRate) - parseFloat(entry.vacRate)
                    noVac += 100 - parseFloat(entry.oneDoseRate)
                    index++;
                }
                if (!(entry.plusBooster18 == (null | "") || entry.plusBooster65 == (null | "") || entry.plusRate18 == (null | "") || entry.plusRate65 == (null | ""))) {
                    booster18 += parseFloat(entry.plusBooster18)
                    booster65 += parseFloat(entry.plusBooster65)
                    rate18 += parseFloat(entry.plusRate18)
                    rate65 += parseFloat(entry.plusRate65)
                    index2++;
                }
            });
            setVaccinationTotal([round(fullyVacBooster / index, 1), round(fullyVac / index, 1), round(firstVac / index, 1), round(noVac / index, 1)])
            setDataList([round(booster18 / index2, 1), round(booster65 / index2, 1), round(rate18 / index2, 1), round(rate65 / index2, 1)])
        }
    }

    return (
        <div>
            <form>
                <div className='allSelections'>
                    <div className='selectContainer'>
                        <label for="queryState" className="queryLabel">Enter State: </label>
                        <select name="queryState" id="searchState" className="selectOption" onChange={(e) => changePieState(e.target.value)}>
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
            <div className='chartAndData'>
                <Plot
                    data={[
                        {
                            type: 'pie',
                            values: vaccinationTotal,
                            labels: ['Fully Vaccinated + Boosted', 'Fully Vaccinated', 'First Dose', 'None'],
                            marker: {
                                colors: [
                                    'rgb(59, 125, 59)',
                                    'rgb(65, 154, 65)',
                                    'rgb(59, 186, 59)',
                                    'rgb(159, 201, 159)'
                                ],
                                line: {
                                    color: 'rgb(239, 239, 239)',
                                    width: 2
                                }
                            },
                            textfont: {
                                family: 'Segoe UI',
                                color: 'white',
                                size: 30
                            },
                            hoverlabel: {
                                bgcolor: [
                                    'rgb(59, 125, 59)',
                                    'rgb(65, 154, 65)',
                                    'rgb(59, 186, 59)',
                                    'rgb(159, 201, 159)'
                                ],
                                bordercolor: 'rgb(239, 239, 239)',
                                font: {
                                    family: 'Segoe UI',
                                    color: 'white',
                                    size: 18
                                }
                            }
                        },
                    ]}
                    layout={{ width: 800, height: 700, title: dropDownValue + " Vaccination Percentage", titlefont: { size: 30 }, legend: { traceorder: 'normal' }, plot_bgcolor: 'rgb(239, 239, 239)', paper_bgcolor: 'rgb(239, 239, 239)', legend: { font: { size: 16 } } }}
                    config={{ displayModeBar: false }}
                />
                <div className='vaccStats'>
                    <article className="vaccprofile">
                        <span className="vaccname">Booster 18+</span>
                        <span className="vaccvalue">{dataList[0]}%</span>
                    </article>
                    <article className="vaccprofile">
                        <span className="vaccname">Booster 65+</span>
                        <span className="vaccvalue">{dataList[1]}%</span>
                    </article>
                    <article className="vaccprofile">
                        <span className="vaccname">Vaccinated 18+</span>
                        <span className="vaccvalue2">{dataList[2]}%</span>
                    </article>
                    <article className="vaccprofile">
                        <span className="vaccname">Vaccinated 65+</span>
                        <span className="vaccvalue2">{dataList[3]}%</span>
                    </article>
                </div>
            </div>
        </div>
    )
}