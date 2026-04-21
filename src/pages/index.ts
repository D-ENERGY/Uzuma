import "../css/index-page.css";
import { assetUrl, pageUrl } from "../lib/paths";

document.body.innerHTML = `
    <div class="center-badge">USUMA DISTRICT, ABUJA</div>

    <div class="container">
        <a href="${pageUrl("greenhills/")}" class="side army">
            <div class="logo-box">
                <img src="${assetUrl("army-logo.jpeg")}" alt="Army Logo">
            </div>
            <h1>Greenhills City</h1>
            <p>Meeting your needs in Infrastructures and Buildings</p>
            <div class="enter-btn">Enter Site</div>
        </a>

        <a href="${pageUrl("whitehills/")}" class="side navy">
            <div class="logo-box">
                <img src="${assetUrl("navy-logo.jpeg")}" alt="Navy Logo">
            </div>
            <h1>Whitehills City</h1>
            <p>Meeting your needs in Infrastructures and Buildings</p>
            <div class="enter-btn">Enter Site</div>
        </a>
    </div>

    <footer>
        Plot 267, Behind Katampe Extension, Usuma District, Abuja | <strong>By Jumong Projects Limited</strong> | &copy; 2026
    </footer>
`;
