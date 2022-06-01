import './Bar.css'
import React, { Component, useState, useEffect } from 'react';
import db from './firebase.config';
import { ref, push, getDatabase, get, child } from 'firebase/database'
import Plot from 'react-plotly.js';

export default function Bar() {
    const dbRef = ref(getDatabase())

    const [stateListData, setStateListData] = useState([])
    const [vaccinationTotal, setVaccinationTotal] = useState([])

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

    async function changePieState(input) {
        setDropDownValue(input)
        console.log(input)
        let holder = stateListData;

        if (input != 'All States') {
            holder.forEach(function (entry) {
                var name = entry.name;
                if (name == input) {
                    setVaccinationTotal([parseFloat(entry.fullyVacBoosterRate), parseFloat(entry.vacRate) - parseFloat(entry.fullyVacBoosterRate), parseFloat(entry.oneDoseRate) - parseFloat(entry.vacRate), 100 - parseFloat(entry.oneDoseRate)])
                    console.log(vaccinationTotal);
                }
            });
        }
        else {
            let fullyVacBooster = 0.0;
            let fullyVac = 0.0;
            let firstVac = 0.0;
            let noVac = 0.0;
            let index = 0;
            holder.forEach(function (entry) {
                fullyVacBooster += parseFloat(entry.fullyVacBoosterRate)
                fullyVac += parseFloat(entry.vacRate) - parseFloat(entry.fullyVacBoosterRate)
                firstVac += parseFloat(entry.oneDoseRate) - parseFloat(entry.vacRate)
                noVac += 100 - parseFloat(entry.oneDoseRate)
                index++;
                //console.log(vaccinationTotal);
            });
            console.log(fullyVacBooster);
            console.log(fullyVac);
            console.log(firstVac);
            console.log(noVac);
            setVaccinationTotal([fullyVacBooster / index, fullyVac / index, firstVac / index, noVac / index])
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
                    </div>
                </div>
            </form>
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
                                color: 'rgb(128, 128, 128)',
                                width: 2
                            }
                        },
                        textfont: {
                            family: 'Segoe UI',
                            color: 'white',
                            size: 30
                        },
                        hoverlabel: {
                            bgcolor: 'rgb(128, 128, 128)',
                            bordercolor: 'rgb(128, 128, 128)',
                            font: {
                                family: 'Segoe UI',
                                color: 'white',
                                size: 18
                            }
                        }
                    },
                ]}
                layout={{ width: 700, height: 700, title: dropDownValue + " Vaccination Percentage", legend: { traceorder: 'normal' } }}
                config={{ displayModeBar: false }}
            />
        </div>
    )
}