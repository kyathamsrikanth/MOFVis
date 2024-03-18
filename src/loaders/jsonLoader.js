function createData(name, void_fraction, surface_area_m2cm3, surface_area_m2g, pld, lcd) {
  return {
    name,
    void_fraction,
    surface_area_m2cm3,
    surface_area_m2g,
    pld,
    lcd,
  };
}


function getData() {
  const data = [];
  const numberOfFiles = 30 ;
  for (let i = 0; i < numberOfFiles; i++) {
    const item = require(`./../json_data/hMOF-${i}.json`);
    data.push(
      createData(item.name, item.void_fraction, item.surface_area_m2cm3, item.surface_area_m2g, item.pld, item.lcd),
    );
  }
  return data;
}

export default getData;
