

\# 3D Printer Control Card



A configurable and responsive Lovelace card for controlling 3D printers in Home Assistant.



Designed for:

\- Klipper

\- Moonraker

\- Fluidd

\- Mainsail

\- External Home Assistant camera integrations

\- Custom printer entities and services



\## Features



\### Printer dashboard

\- Configurable printer name.

\- Current print thumbnail.

\- Current G-code filename.

\- Print progress percentage.

\- Print start time.

\- Estimated print completion.

\- Remaining print time.



\### Printer controls

\- Pause

\- Resume

\- Cancel

\- Emergency Stop



\### Custom actions

\- Klipper macros.

\- Bed mesh calibration.

\- Home all axes.

\- Center nozzle.

\- Park print head.

\- Custom Home Assistant services.

\- External links to Fluidd and Mainsail.



\### Statistics

\- Nozzle temperature.

\- Bed temperature.

\- Chamber temperature.

\- MCU temperature.

\- Filament dryer temperature.

\- Any other Home Assistant entity.

\- Custom units, icons, ordering and tile sizes.



\### Cameras

\- Moonraker camera entities.

\- External Home Assistant camera entities.

\- Image entities.

\- Multiple cameras.

\- Configurable refresh interval.

\- Configurable image aspect ratio.



\### Offline mode

\- Configurable connection entity.

\- Custom offline states.

\- Sleeping printer SVG illustration.

\- Optional animated Zzz graphics.



\### Visual editor

\- No YAML editing required for normal setup.

\- Entity selection.

\- Automatic entity discovery.

\- Custom button configuration.

\- Statistics and camera management.

\- Section visibility and layout settings.



\### Multiple printers

Each card instance has its own configuration.

Multiple printers can be displayed independently

on the same dashboard.



\## Requirements



\- Home Assistant 2025.1 or newer.

\- A supported browser.

\- Node.js 20 or newer for development and building.



The Moonraker integration is recommended but not mandatory.

The card works with entities and services exposed by Home Assistant.



\## Installation



\### HACS



1\. Open HACS.

2\. Open the Frontend or Dashboard section.

3\. Open the three-dot menu.

4\. Select Custom repositories.

5\. Add this GitHub repository.

6\. Select Dashboard as the category.

7\. Install 3D Printer Control Card.

8\. Add its JavaScript resource if HACS has not registered it automatically.



Resource path:



`/hacsfiles/3d-printer-control-card/dist/printer-control-card.js`



Resource type:



`JavaScript module`



\### Manual installation



1\. Download or clone the repository.

2\. Install dependencies:



```bash

npm install

```



3\. Build the card:



```bash

npm run build

```



4\. Copy the generated file:



`dist/printer-control-card.js`



to:



`/config/www/printer-control-card.js`



5\. Open Home Assistant.

6\. Go to Settings -> Dashboards -> Resources.

7\. Add:



`/local/printer-control-card.js`



Resource type: `JavaScript module`.



\## Configuration



The card can be configured using the visual editor.



Alternatively, YAML configuration is supported.



See:



`examples/configuration.yaml`



\## Automatic discovery



The editor can analyse available Home Assistant entities.



It searches for typical:

\- Printer connection sensors.

\- Print state sensors.

\- Current filename sensors.

\- Progress sensors.

\- Start and finish time sensors.

\- Thumbnail entities.

\- Printer control buttons.

\- Emergency stop buttons.



Automatic discovery provides suggestions.

Always verify the selected entities before using printer controls.



For installations with multiple printers, use the printer name or entity prefix as a discovery filter.



\## Actions



Actions support:



\- `entity`

\- `service`

\- `target`

\- `service\_data`

\- `url`

\- `confirmation`

\- `confirmation\_text`

\- `enabled`



Examples:



```yaml

quick\_actions:

&#x20; - label: Bed mesh

&#x20;   entity: button.voron\_bed\_mesh



&#x20; - label: Fluidd

&#x20;   url: http://fluidd.local



&#x20; - label: Park head

&#x20;   service: button.press

&#x20;   target:

&#x20;     entity\_id: button.voron\_park\_head

```



Emergency Stop always requires a confirmation in the card.



It must be mapped to the actual emergency stop entity or service provided by the printer integration.



Emergency Stop is not the same operation as Cancel.



\## Cameras



Camera entities from Home Assistant are supported.



Examples include:

\- Moonraker cameras.

\- Tapo cameras exposed through Home Assistant.

\- LSC cameras exposed through Home Assistant.

\- Other compatible camera integrations.



Direct image URLs can also be configured.



RTSP streams should be exposed through a Home Assistant camera integration first.

An RTSP address is not directly playable by a standard HTML image element.



\## Multiple printers



Create one card instance for each printer.



Each instance can have different:

\- Printer entities.

\- Controls.

\- Macros.

\- Cameras.

\- Statistics.

\- Offline configuration.



\## Development



Clone the repository:



```bash

git clone https://github.com/YOUR\_GITHUB\_USERNAME/3d-printer-control-card.git

cd 3d-printer-control-card

```



Install dependencies:



```bash

npm install

```



Build:



```bash

npm run build

```



Run tests:



```bash

npm test

```



Development build:



```bash

npm run watch

```



The compiled card is generated in:



`dist/printer-control-card.js`



\## Project structure



```text

3d-printer-control-card/

│

├── src/

│   ├── core/

│   │   ├── config.js

│   │   ├── discovery.js

│   │   ├── utils.js

│   │   ├── actions.js

│   │   └── localize.js

│   │

│   ├── card/

│   │   └── printer-control-card.js

│   │

│   ├── editor/

│   │   └── printer-control-card-editor.js

│   │

│   ├── styles/

│   │   └── card.js

│   │

│   └── translations/

│       ├── pl.json

│       └── en.json

│

├── dist/

├── examples/

├── tests/

│

├── package.json

├── hacs.json

├── README.md

├── CHANGELOG.md

└── LICENSE

```



\## License



MIT



