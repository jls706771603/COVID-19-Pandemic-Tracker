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
                            <h1 className='aboutTitle'>How'd it Start?</h1>
                            <p className='aboutMessage2'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                        </div>
                    </section>
                    <section style={{ backgroundImage: `url(${terrain})` }}>
                        <div className='aboutBox'>
                            <h1 className='aboutTitle'>Why Developed?</h1>
                            <p className='aboutMessage2'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                        </div>
                    </section>
                    <section className='seattleBackground' style={{ backgroundImage: `url(${seattle})` }}>
                        <div className='aboutBox'>
                            <h1 className='aboutTitle'>Meet The Team</h1>
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