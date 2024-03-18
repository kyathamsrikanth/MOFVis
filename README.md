# MOFVis

## Introduction

'MOFVis,' is a specialized web application designed to transform MOF research by providing unique and interactive visualizations that connect structural information to functional properties and simplify the exploration of MOF structures, fostering deeper insights and accelerating the pace of MOF-related discoveries.

## Team Members

- Venkata Sesha Phani, Vakicherla
- Srikanth Kyatham
- Sri Sai Kiran Reddy Gorla

## Repository details

This project frontend was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Backed is bootstrapped with a Conda Flask server.


## Prerequisites

- Conda installed: You need to have Conda installed on your system.
- Python: Your Conda environment should have Python installed.

<img width="1470" alt="Screenshot 2023-11-30 at 5 13 26 AM" src="https://github.com/SeshaPhaniVV/MofVis/assets/114699421/92d2b098-6578-462c-85b0-a55298e87161">
  
<img width="1459" alt="Screenshot 2023-11-30 at 5 13 45 AM" src="https://github.com/SeshaPhaniVV/MofVis/assets/114699421/db4e44df-6548-4a0d-88ed-4d80fa7d7b3f">

## Features


MOFVis provides a suite of interactive tools and features designed to enhance the exploration and analysis of Metal-Organic Frameworks:


- **Dynamic Data Table**: An interactive table displaying essential MOF properties allows for sorting and immediate access to detailed structure visualizations.
- **3D Visualization**: High-resolution 3D models of MOFs can be manipulated through user controls for an immersive examination of molecular configurations.
- **Analytical Scatter Plot**: A responsive scatter plot graphically correlates MOF surface area with void fraction, providing instant visual insights into structural properties.
- **Composition Histogram**: A clear, segmented histogram shows the atomic makeup of MOFs, facilitating a quick assessment of their elemental composition.
- **Pore Characterization**: Interactive violin plots detail pore size distributions, offering a visual summary of key structural metrics like pore limiting diameters.
- **Custom Uploads**: The platform supports direct PDB file uploads, enabling personalized visualization and analysis of user-specific MOF structures.

## Backend Server Setup

### 1) Go to backend directory

`cd backend`

### 2) if you need to create a Conda environment

`conda create --name my-env`

### 3) if you need to activate a Conda environment

`conda activate my-env`

`conda install --file requirements.txt`

### 4) start backend server in port 5000

`flask --app api run`

## Frontend Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.



## Usability

The MOFVis interface is designed for clarity and ease, ensuring a seamless user experience:

- **Guided Navigation**: Navigate through the platform's features with an intuitive layout and clearly labeled controls.
- **Real-Time Interactivity**: Live updates in data visualization respond to user actions, allowing for a hands-on analytical approach.
- **Enhanced Accessibility**: Complex MOF data is rendered into comprehensible visual formats, making the platform valuable for both experienced researchers and educational purposes.
- **Effortless Workflow**: From data upload to detailed analysis, each step is optimized for user convenience and efficiency.



## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Credits

- https://github.com/facebook/create-react-app
- https://github.com/schrodinger/pymol-open-source
- https://flask.palletsprojects.com/en/3.0.x/
- https://threejs.org/examples/webgl_loader_pdb
- https://anaconda.org/anaconda/conda
- https://mof.tech.northwestern.edu/
  
