import React, { useState, useEffect } from 'react';
import { Pie, Chart } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chart.js/auto';
import './App.css'; // Make sure this import is correct for your file structure
import Modal from 'react-modal';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

Modal.setAppElement('#root'); // Replace '#root' with the ID of your app's root element if different

const PageWheel = () => {
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [selectedSlice, setSelectedSlice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [spinCount, setSpinCount] = useState(0);

    const labels = Array.from({ length: 20 }, () => "?");
    const hoverTexts = [
        "10% off Any Card: HORNS-10", "Not Lucky Today, Sorry!", "30% off Any Card: HORNS-30", "10% off Any Card: HORNS-10", "50% off Any Card: HORNS-50",
        "Free Card $25 Max Value: HORNS-GC-25", "10% off Any Card: HORNS-10", "Nada - Thanks for Playing!", "You Win Nothing, Sorry!", "10% off Any Card: HORNS-10",
        "Still Nothing...  Spin Again!", "10% off Any Card: HORNS-10", "20% off Any Card: HORNS-20", "You Win Nothing, Sorry!", "10% off Any Card: HORNS-10",
        "10% off Any Card: HORNS-10", "Still Nothing...  Spin Again!", "10% off Any Card: HORNS-10", "20% off Any Card: HORNS-20", "10% off Any Card: HORNS-10"
    ];

    const data = {
        labels: labels,
        datasets: [
            {
                data: Array(labels.length).fill(1),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#66FF66', '#FF6666', '#6666FF', '#FFB347',
                    '#FF5733', '#C70039', '#900C3F', '#581845', '#DAF7A6',
                    '#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845'
                ],
                borderColor: 'peru',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                color: 'white',
                font: {
                    weight: 'bold',
                    size: 18,
                },
                formatter: () => "?",
                anchor: 'center',
                align: 'center',
                clamp: true,
            },
            tooltip: {
                enabled: false, // Disable the tooltip display
            },
        },
        rotation: -90,
        animation: {
            duration: 0, // Disable the chart.js animation to use CSS animation instead
        },
    };

    useEffect(() => {
        // Check local storage for spin count and timestamp
        const storedData = localStorage.getItem('spinData');
        if (storedData) {
            const { count, timestamp } = JSON.parse(storedData);
            const currentTime = new Date().getTime();
            const oneWeek = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds

            if (currentTime - timestamp < oneWeek) {
                setSpinCount(count);
            } else {
                // Reset count after one week
                localStorage.setItem('spinData', JSON.stringify({ count: 0, timestamp: currentTime }));
            }
        }
    }, []);

    const handleSpin = () => {
        if (spinning || spinCount >= 3) return;

        const spins = 1000; // Increase spins to make the wheel go faster
        const degreePerSlice = 360 / data.labels.length;
        const randomSlice = Math.floor(Math.random() * data.labels.length);
        const offset = Math.random() * degreePerSlice - (degreePerSlice / 2); // Add a random offset to avoid ending on a line
        const finalRotation = spins * 360 + randomSlice * degreePerSlice + offset;

        setSpinning(true);
        setRotation(finalRotation);

        setTimeout(() => {
            setSpinning(false);
            const normalizedRotation = (finalRotation % 360 + 360) % 360; // Normalize the rotation to [0, 360)
            const sliceIndex = Math.floor((normalizedRotation + 90) / degreePerSlice) % data.labels.length;
            setSelectedSlice(hoverTexts[sliceIndex]); // Display the hover text for the selected slice
            setIsModalOpen(true); // Open the modal

            // Update spin count in local storage
            const currentTime = new Date().getTime();
            const newCount = spinCount + 1;
            localStorage.setItem('spinData', JSON.stringify({ count: newCount, timestamp: currentTime }));
            setSpinCount(newCount);
        }, 7000); // 7 seconds for the spinning duration
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSlice(null); // Reset the selected slice
        window.location.reload(); // Reload the page when the modal is closed
    };

    const renderShopLink = () => {
        const linkStyle = {
            color: 'blue',
            textDecoration: 'underline',
            marginTop: '10px'
        };
        switch (selectedSlice) {
            case "10% off Any Card: HORNS-10":
                return <a style={linkStyle} href="https://www.ebay.com/sme/atx-longhorn/Extra-10-off/so.html?_soffType=CodedCouponOffer&_soffid=3BuW7YibI7i-g6cpxo4reA%253D%253D&mkcid=16&ssspo=5vDCbFbgQti&ssuid=5vDCbFbgQti&mkrid=711-127632-2357-0&widget_ver=artemis&sssrc=2374585&mkevt=1&media=COPY" target="_blank" rel="noopener noreferrer">Shop eBay Now</a>;
            case "20% off Any Card: HORNS-20":
                return <a style={linkStyle} href="https://www.ebay.com/sme/atx-longhorn/Extra-20-off/so.html?_soffType=CodedCouponOffer&_soffid=cwcSH53yO1CI9yewg-DCVg%253D%253D&sssrc=2374585&mkevt=1&mkcid=16&ssspo=5vDCbFbgQti&ssuid=5vDCbFbgQti&mkrid=711-127632-2357-0&widget_ver=artemis&media=COPY" target="_blank" rel="noopener noreferrer">Shop eBay Now</a>;
            case "30% off Any Card: HORNS-30":
                return <a style={linkStyle} href="https://www.ebay.com/sme/atx-longhorn/Extra-30-off/so.html?_soffType=CodedCouponOffer&_soffid=1sIljo8ux_IeR-SBh8Sfxw%253D%253D&ssuid=5vDCbFbgQti&mkrid=711-127632-2357-0&widget_ver=artemis&sssrc=2374585&mkevt=1&mkcid=16&ssspo=5vDCbFbgQti&media=COPY" target="_blank" rel="noopener noreferrer">Shop eBay Now</a>;
            case "50% off Any Card: HORNS-50":
                return <a style={linkStyle} href="https://www.ebay.com/sme/atx-longhorn/Extra-50-off/so.html?_soffType=CodedCouponOffer&_soffid=bMJGWoyPh_VctvBoAi9eHQ%253D%253D&widget_ver=artemis&sssrc=2374585&mkevt=1&mkcid=16&ssspo=5vDCbFbgQti&ssuid=5vDCbFbgQti&mkrid=711-127632-2357-0&media=COPY" target="_blank" rel="noopener noreferrer">Shop eBay Now</a>;
            case "Free Card $25 Max Value: HORNS-GC-25":
                return <a style={linkStyle} href="https://www.ebay.com/sme/atx-longhorn/Extra-25-off/so.html?_soffType=CodedCouponOffer&_soffid=4KUSJxlpu0C-g6cpxo4reA%253D%253D&widget_ver=artemis&sssrc=2374585&mkevt=1&mkcid=16&ssspo=5vDCbFbgQti&ssuid=5vDCbFbgQti&mkrid=711-127632-2357-0&media=COPY" target="_blank" rel="noopener noreferrer">Shop eBay Now</a>;
            default:
                return null;
        }
    };

    return (
        <div className="page-wheel-container">
            <h1>Spin the Wheel!</h1>
            <p className="page-wheel-text">
                <strong>Spin the wheel for your chance at special prizes and discounts</strong>
            </p>
            <div className="wheel-and-marker-container">
                <div className="pie-chart-container">
                    <div className={`pie-chart ${spinning ? 'spinning' : ''}`} style={{ transform: `rotate(${rotation}deg)` }}>
                        <Pie data={data} options={options} />
                    </div>
                </div>
            </div>
            <button className="spin-button" onClick={handleSpin} disabled={spinning || spinCount >= 3}>
                {spinCount >= 3 ? "Maximum Spins Reached, Try Again Next Week!" : "Spin"}
            </button>
            <div className="prize-info-container" style={{ borderColor: 'peru' }}>
                <p>Possible Prizes: 10% Off (45%), 20% Off (10%), 30% Off (5%), 50% Off (5%), and Free $25 Card (5%)</p>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Selected Slice Modal"
                className="modal"
                overlayClassName="overlay"
            >
                <div className="modal-content">
                    <h2>Congratulations!</h2>
                    <p>{selectedSlice}</p>
                    {renderShopLink()}
                    <button className="close-button" onClick={closeModal}>Close</button>
                </div>
            </Modal>
        </div>
    );
};

export default PageWheel;
