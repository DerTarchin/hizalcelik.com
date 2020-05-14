var img_data = [
  // top section
  [
    {
      img: 'car1.jpeg',
      size: '1920x1080',
    },
    {
      img: 'car2.jpeg',
      size: '1920x1080',
    },
    {
      img: 'line.jpg',
      size: '1826x1360',
    },
  ],
  // day
  [
    {
      img: 'day.gif',
      size: '512x288',
      title: 'Scanning',
      cap: 'Driving under cars in the parking lot.'
    }
  ],
  // night
  [
    {
      img: 'night.gif',
      size: '512x288',
      title: 'Scanning',
      cap: 'Scanning at night provided clearer laser footage.'
    }
  ],
  // algo
  [
    {
      img: 'algo.gif',
      size: '512x287',
      title: 'Laser Line Extraction',
      cap: 'Algo designed to extract the brightest points of the line.'
    }
  ],
  // pointcloud
  [
    {
      img: 'pointcloud.gif',
      size: '576x324',
      title: 'Point Cloud',
      cap: 'Every frame displayed side by side in a 3D canvas.'
    }
  ],
  // poly
  [
    {
      img: 'poly.gif',
      size: '576x323',
      title: '3D Polygon Model',
      cap: 'Point cloud "layers" connected together to form polygons.'
    }
  ],
  // cars section
  [
    {
      img: 'subaru1.gif',
      size: '672x420',
      title: 'Subaru Outback',
      cap: 'Undercarriage of a Subaru Outback.'
    },
    {
      img: 'subaru2.gif',
      size: '672x420',
      title: 'Subaru Outback',
      cap: 'Undercarriage of a Subaru Outback.'
    },
    {
      img: 'volvo1.gif',
      size: '672x420',
      title: 'Volvo XC60',
      cap: 'Undercarriage of a Volvo XC60.'
    },
    {
      img: 'volvo2.jpeg',
      size: '2000x1000',
      title: 'Volvo XC60',
      cap: 'Undercarriage of a Volvo XC60.'
    },
    {
      img: 'volvo3.jpeg',
      size: '2000x1000',
      title: 'Volvo XC60',
      cap: 'Undercarriage of a Volvo XC60.'
    },
  ],
  // 3d printing section
  [
    {
      img: '3d1.jpg',
      size: '1472x798',
      title: 'Planning 3D box',
      cap: 'Gaps needed to be filled from missing point data, and outliers needed normalization.'
    },
    {
      img: '3d2.jpg',
      size: '956x1330',
      title: 'Planning 3D box',
      cap: 'Gaps needed to be filled from missing point data, and outliers needed normalization.'
    },
    {
      img: '3d3.gif',
      size: '576x324',
      title: '3D Printing',
      cap: 'A 3D printing of the Volvo XC60 scan.'
    },
    {
      img: '3d4.jpeg',
      size: '2000x1333',
      title: '3D Printed Undercarriage',
    },
    {
      img: '3d5.jpeg',
      size: '2000x1333',
      title: '3D Printed Undercarriage',
    },
  ],
  // exhibition section
  [
    {
      img: 'exhibition1.jpg',
      size: '2000x1500',
    },
    {
      img: 'exhibition2.jpg',
      size: '2000x1500',
    },
    {
      img: 'exhibition3.jpg',
      size: '2000x1333',
    },
    {
      img: 'exhibition4.jpg',
      size: '2000x1333',
    },
    {
      img: 'exhibition5.jpg',
      size: '2000x1333',
    },
    {
      img: 'exhibition6.jpg',
      size: '2000x1333',
    },
    {
      img: 'exhibition7.jpg',
      size: '2000x1333',
    },
    {
      img: 'exhibition8.jpg',
      size: '2000x1333',
    },
    {
      img: 'exhibition9.jpg',
      size: '2000x1333',
    },
    {
      img: 'exhibition10.jpg',
      size: '2000x1333',
    },
    {
      img: 'exhibition11.jpg',
      size: '2000x1333',
    },
    {
      img: 'exhibition12.jpg',
      size: '2000x1333',
    },
  ],
  // issues section
  [
    {
      img: 'issues1.jpg',
      size: '1386x1040',
      title: 'Accidentally flipped X and Y Axis'
    },
    {
      img: 'issues2.gif',
      size: '512x288',
      title: 'Reflective Car Undersides',
      cap: 'Shiney and reflective cars cause undesirable effects in the resulting 3D models.'
    },
    {
      img: 'issues3.gif',
      size: '772x484',
      title: 'Bad Data Model',
      cap: 'Shiney and reflective cars cause undesirable effects in the resulting 3D models.'
    },
  ]
];

initIndiePage(img_data, 'carscanner');