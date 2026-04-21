import "../css/greenhills.css";
import { assetUrl, pageUrl } from "../lib/paths";

document.body.innerHTML = `
    <header><img src="${assetUrl("army-logo.jpeg")}" class="logo" alt="Army Logo">
        <div style="text-align: left; margin-bottom: 20px;">
            <a href="${pageUrl("")}" style="text-decoration: none; color: var(--primary-green); font-weight: bold; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 5px;">
                ← Back to Project Selection
            </a>
        </div>
    </header>
    
    <div class="hero">
        <h1>Greenhills City</h1>
        <p>Motto: Meeting your needs in Infrastructures and Buildings</p>
    </div>

    <div class="container">
        <div class="grid">
            <div class="card">
                <h2>Our Vision</h2>
                <p>To Provide State of the Art Infrastructures and Buildings in Nigeria.</p>
            </div>
            <div class="card">
                <h2>Our Mission</h2>
                <p>To Provide Quality Infrastructures and Buildings using Standard Materials, Equipments and Technology in Nigeria.</p>
            </div>
        </div>

        <h2 style="margin-top:40px; border-left: 10px solid var(--gold); padding-left: 15px;">Our Goals</h2>
        <ul>
            <li>To provide quality infrastructures and Buildings in Nigeria.</li>
            <li>To make use of standard materials, equipments and technology in the provision of infrastructures and Buildings in Nigeria.</li>
            <li>To provide pre and post construction Job opportunities to restive youths in Nigeria.</li>
            <li>To add to the development mantra of Mr President of Nigeria.</li>
        </ul>

        <div class="btn-container">
            <a href="#" class="btn btn-green">📄 Download Application Form</a>
            <a href="#" class="btn btn-outline">📖 Read Master Plan</a>
            <a href="#" class="btn btn-gold">⬇️ Download Project Brief</a>
        </div>

        <div class="location-section">
            <p><strong>Site Location:</strong> Plot 267, Behind Katampe Ext, Usuma District, Abuja</p>
        </div>
    </div>

    <footer>
        <p><strong>By Jumong Projects Limited</strong><br>
        Plot 267, Behind Katampe Extension, Usuma District, Abuja<br>
        &copy; 2026 Greenhills City. All Rights Reserved.</p>
    </footer>
`;
