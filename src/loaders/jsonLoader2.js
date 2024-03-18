function createDataViolin(name, values) {
    return {
      name,
      values,
    };
  }
  
  function getDataViolin() {
    let data = [];
    const numberOfFiles = 30;
    for (let i = 0; i < numberOfFiles; i++) {
      const item = require(`./../json_data/hMOF-${i}.json`);
      data.push(createDataViolin('Pore Limiting Diameter', item.pld));
      data.push(createDataViolin('Largest Cavity Diameter', item.lcd));
    }
    return data;
  }
export default getDataViolin;