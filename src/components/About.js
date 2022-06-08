import './About.css'
import React, { Component, useState, useEffect } from 'react';
import seattle from "../images/seattle.jpg";
import city from "../images/city.jpg";
import terrain from "../images/terrain.jpg";
import { Layout } from "./Layout";

export default function About() {
    return (
        <Layout>
            <div>
                <div className='aboutContainer'>
                    <section style={{ backgroundImage: `url(${city})` }}>
                        <div className='aboutBox'>
                            <h1 className='aboutTitle'>Our Mission</h1>
                            <p className='aboutMessage2'>Like most, we began concerned about the COVID 19 Pandemic and its affect on our communities. We set out to create a tool that provides easy and digestible data regarding the pandemic in the United States. Given the pandemics complexity and ability to change rapidly, our mission is to provide an easy snapshot into its current state. The pandemic tracker allows users to track detailed data such as case rates, deaths, and vaccination data.</p>
                        </div>
                    </section>
                    <section style={{ backgroundImage: `url(${terrain})` }}>
                        <div className='aboutBox'>
                            <h1 className='aboutTitle'>Resources</h1>
                            <p className='aboutMessage2'>The COVID 19 Pandemic Tracker is developed using a mix of technologies. React, Firebase, and Node.js are all used in its implementation. Multiple libraries also make it possible. Source data is drawn directly from the NY Times Github Repo to provide accurate and timely data.</p>
                        </div>
                    </section>
                    <section className='seattleBackground' style={{ backgroundImage: `url(${seattle})` }}>
                        <div className='aboutBox'>
                            <h1 className='aboutTitle'>The Team</h1>
                            <p className='aboutMessage'>Jonas Amoa</p>
                            <p className='aboutMessage3'>Henry Li</p>
                            <p className='aboutMessage3'>Leo Kostin</p>
                            <p className='aboutMessage3'>Liansheng Jin</p>
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    )
}