sRt =//Init GoogleChart
google.charts.load('current', {
  packages: ['corechart']
});
google.charts.setOnLoadCallback(drawChart);

function X(arr) {
  return new Number(arr[0]);
}

function Y(arr) {
  return new Number(arr[1]);
}

v = new Vue({
  el: '#l-gui',
  data: {
    rectCords: {
      p1: [-1, 6], // X Y
      p2: [0, 0],
      p3: [0, 0],
      p4: [8, -1]
    },
    triangleCords: {
      p1: [0, 10],
      p2: [0, 0],
      p3: [10, 0]
    },
    result: '',
    accuracy: 100,
    debug: '',
    pickedSize: 'auto'
  },
  methods: {
    calculate: function() {
      v.result = '';
      rt = v.rectCords;
			ta = v.triangleCords;
      time = performance.now();
      //Конвертация в числа
      v.rectCord = {
          p1: [Number(rt.p1[0]), Number(rt.p1[1])],
          p2: [Number(rt.p2[0]), Number(rt.p2[1])],
          p3: [Number(rt.p3[0]), Number(rt.p3[1])],
          p4: [Number(rt.p4[0]), Number(rt.p4[1])]
      };
      v.triangleCords = {
          p1: [Number(ta.p1[0]), Number(ta.p1[1])],
          p2: [Number(ta.p2[0]), Number(ta.p2[1])],
          p3: [Number(ta.p3[0]), Number(ta.p3[1])]
      };
      ta = v.triangleCords;
      rt = v.rectCord;
      //Лево верх - r1 право низ - r2
      x1 = rt.p1[0] < rt.p4[0]?rt.p1[0]:rt.p4[0];
      x2 = rt.p1[0] > rt.p4[0]?rt.p1[0]:rt.p4[0];
      y1 = rt.p1[1] > rt.p4[1]?rt.p1[1]:rt.p4[1];
      y2 = rt.p1[1] < rt.p4[1]?rt.p1[1]:rt.p4[1];
      v.rectCords.p1 = [x1, y1];
      v.rectCords.p4 = [x2, y2];
      console.log(rt);
      //Рассчитываем недостающие точки прямоугольника
      r1 = v.rectCords.p1;
      r4 = v.rectCords.p4; // .-----?
      r2 = [r4[0], r1[1]]; // |     |
      r3 = [r1[0], r4[1]]; // ?-----.
      v.rectCords.p2 = r2;
      v.rectCords.p3 = r3;
      //Рассчитываем недостающую точку треугольника
      t1 = v.triangleCords.p1;
      t2 = [0.0, 0.0]; // |\
      // | \
      // ?__\
      t3 = v.triangleCords.p3;
      t2 = [t1[0], t3[1]]; // [t1[x] t2[y]]
      v.triangleCords.p2 = t2;

			//Определяем номер типа решаемой задачи
			numberSM = v.searchMethod();
			calcFM = v.calculateForMethod(numberSM);
			//Расшифровки номеров
			methods = {0: 'Неизвестное состояние.',
                 1: 'Фигуры не пересекаются и не соприкасаются.',
								 2: 'Треугольник полностью в прямоугольнике.',
								 3: 'Прямоугольник полностью в треугольнике.',
                 4: 'Фигуры соприкасаются.',
                 5: 'Неверное расположение треугольника.',
                 6: '2 точки в треугольнике, остальное - слева вне треугольника.',
                 7: '1 точка в треугольнике, остальное - слева внизу вне треугольника',
                 8: '2 точки под треугольником.',
                 9: '1 точка в треугольнике, остальное - справа под треугольником.',
                 10: '1 точка в треугольнике, остальное - справа снизу треугольника.',
                 11: '3 точки в треугольнике, оставшаяся - вне, справа.',
                 12: '2 точки в треугольнике, остальные - справа от треугольника.',
                 13: '1 точка в треугольнике, остальные - справа от треугольника.',
                 14: '1 точка треугольника в квадрате, точки прямоугольника - вне, над треугольником.',
                 15: 'Прямоугольник горизонтально захватывает часть треугольника, не входя в него точками.',
                 16: 'Прямоугольник горизонтально захватывает часть треугольника, входя в него лишь одной точкой.',
                 17: 'Прямоугольник горизонтально захватывает 2 точки треугольника, не входя в него.',
                 18: 'Прямоугольник вертикально захватывает 2 точки треугольника, не входя в него.',
                 19: 'Прямоугольник вертикально паересекает треугольник, не входя в него.',
                 20: 'Правый нижний угол прямоугольника в треугольнике.',
                 21: 'Два верхних угла прямоугольника вне треугольника.',
                 22: 'Нижний правый угол треугольника в прямоугольнике. Ни один угол прямоугольника не входит в треугольник.',
                 23: 'Нижний левый угол треугольника в прямоугольнике. Ни один угол прямоугольника не входит в треугольник.'
                };
			v.result = "№ "+numberSM+"\n"+methods[numberSM]+"\nПлощадь пересечения: "+calcFM;

      //Отрисовка графика
      coordinates = getFiguresCoordinatesFromCoordinatesForms();
      drawChart(coordinates);
    },
    //Находится ли точка в треугольнике
    inTriangle: function(x, y) {
      t = v.triangleCords;
      step1 = (X(t.p1) - x) * (Y(t.p2) - Y(t.p1)) - (X(t.p2) - X(t.p1)) * (Y(t.p1) - y);
      step2 = (X(t.p2) - x) * (Y(t.p3) - Y(t.p2)) - (X(t.p3) - X(t.p2)) * (Y(t.p2) - y);
      step3 = (X(t.p3) - x) * (Y(t.p1) - Y(t.p3)) - (X(t.p1) - X(t.p3)) * (Y(t.p3) - y);
      if ((step1 <= 0) && (step2 <= 0) && (step3 <= 0))
        return true;
      if ((step1 >= 0) && (step2 >= 0) && (step3 >= 0))
        return true;
      return false;
    },
    inTriangleP: function(pos) {
      return v.inTriangle(X(pos), Y(pos));
    },
    //Находится ли точка в прямоугольнике
    inRectangle: function(x, y) {
			rt = v.rectCords;
      minX = rt.p1[0] < rt.p4[0]?rt.p1[0]:rt.p4[0];
      maxX = rt.p1[0] > rt.p4[0]?rt.p1[0]:rt.p4[0];
      minY = rt.p1[1] < rt.p4[1]?rt.p1[1]:rt.p4[1];
      maxY = rt.p1[1] > rt.p4[1]?rt.p1[1]:rt.p4[1];
			if(x >= minX)
				if(x <= maxX)
					if(y >= minY)
						if(y <= maxY)
							return true;
			return false;
		},
    inRectangleP: function(pos) {
      return v.inRectangle(X(pos), Y(pos));
    },
    sq: function(fig) {//Метод трапеций
      res = 0;
    	for (i=0; i<fig.length; i++)
    	{
  			p1 = i != 0 ? fig[i-1] : fig[fig.length - 1],
  			p2 = fig[i];
    		res += (X(p1) - X(p2)) * (Y(p1) + Y(p2));
    	}
    	return Math.abs(res) / 2;
    },
    lineKBP: function(p1, p2) {
      return v.lineKB(X(p1), Y(p1), X(p2), Y(p2));
    },
    lineKB: function(lx1, ly1, lx2, ly2) {
      k = (ly2-ly1)/(lx2-lx1);
      b = (ly1 - (k) * lx1);
      return {k: k, b: b};
    },
    serchPosXInLine: function(lp1, lp2, y) { //linePos1, linePos2, and Y
      kb = v.lineKBP(lp1, lp2);
      return (y-kb.b)/kb.k;
    },
    serchPosYInLine: function(lp1, lp2, x) { //linePos1, linePos2, and X
      kb = v.lineKBP(lp1, lp2);
      return kb.k*x+kb.b;
    },
    searchMethod: function() {
			rt = v.rectCords;
			ta = v.triangleCords;
      //Неверное расположение треугольника
      if(!((ta.p1[0] < ta.p3[0]) && (ta.p1[1] > ta.p3[1]))) {
        return 5;
      }
      //Фигуры не пересекаются и не соприкасаются
      minX = rt.p1[0] < rt.p4[0]?rt.p1[0]:rt.p4[0];
      maxX = rt.p1[0] > rt.p4[0]?rt.p1[0]:rt.p4[0];
      minY = rt.p1[1] < rt.p4[1]?rt.p1[1]:rt.p4[1];
      maxY = rt.p1[1] > rt.p4[1]?rt.p1[1]:rt.p4[1];

      if(((ta.p1[0] < minX) && (ta.p3[0] < minX))||
        ((ta.p1[0] > maxX) && (ta.p3[0] > maxX)) ||
        ((ta.p1[1] < minY) && (ta.p3[1] < minY)) ||
        ((ta.p1[1] > maxY) && (ta.p3[1] > maxY))) {
          return 1;
      }
      //Фигуры соприкасаются.
      if(((ta.p3[0] == minX) && (ta.p1[0] <= minX) && (ta.p3[1] >= minY) && (ta.p3[1] <= maxY))|| //Треугольник слева
        ((ta.p1[0] == maxX) && (ta.p1[0] >= maxX)) ||
        ((ta.p1[1] == minY) && (ta.p3[1] <= minY) && (ta.p1[0] >= minX) && (ta.p1[0] <= maxX)) || //Нижняя грань
        ((ta.p3[1] == maxY) && (ta.p1[1] >= maxY))) {
          return 4;
      }
			//Полностью в прямоугольнике
      trInRt = v.inRectangleP(ta.p1) &&
         v.inRectangleP(ta.p3) &&
         v.inRectangleP(ta.p2);
      if(trInRt) {
        return 2;
      }
      //Прямоугольник полностью в треугольнике
      rtInTr = v.inTriangleP(rt.p1) &&
      v.inTriangleP(rt.p4) &&
      v.inTriangleP(rt.p2);
      if(rtInTr) {
        return 3;
      }
      //2 точки в треугольнике, остальное - слева вне треугольника
      if((rt.p1[0] <= ta.p1[0]) && (rt.p4[1] >= ta.p3[1]) &&
      v.inTriangleP(rt.p2) && v.inTriangleP(rt.p4)){
        return 6;
      }
      //1 точка в треугольнике, остальное - слева внизу вне треугольника
      if( (rt.p1[0] < ta.p1[0]) && (rt.p4[1] < ta.p3[1]) && v.inTriangleP(rt.p2) ) {
        return 7;
      }
      //2 точки под треугольником.
      if( (Y(rt.p4) <= Y(ta.p3)) && v.inTriangleP(rt.p1) && v.inTriangleP(rt.p2) ) {
        return 8;
      }
      //1 точка в треугольнике, остальное - справа под треугольником (правый верхний угол прямоуг. не в треуг.)
      if( (Y(rt.p4) < Y(ta.p3)) && (X(rt.p4) < X(ta.p3)) && !v.inTriangleP(rt.p2) && v.inTriangleP(rt.p1) ) {
        return 9;
      }
      //1 точка в треугольнике, остальное - справа снизу треугольника
      if( (Y(rt.p4) < Y(ta.p3)) && (X(rt.p4) >= X(ta.p3)) && !v.inTriangleP(rt.p2) && v.inTriangleP(rt.p1) ) {
        return 10;
      }
      //3 точки в треугольнике, оставшаяся - вне, справа
      if( (Y(rt.p4) >= Y(ta.p3)) && (X(rt.p4) <= X(ta.p3)) && !v.inTriangleP(rt.p2) && v.inTriangleP(rt.p4) && v.inTriangleP(rt.p1) ) {
        return 11;
      }
      //2 точки в треугольнике, остальные - справа от треугольника
      if( (X(rt.p1) < X(rt.p4)) && v.inTriangleP(rt.p1) && v.inTriangleP(rt.p3) && !v.inTriangleP(rt.p2) && !v.inTriangleP(rt.p4)) {
        return 12;
      }
      //1 точка в треугольнике, остальные - справа от треугольника.
      if( (X(rt.p1) < X(rt.p4)) && !v.inTriangleP(rt.p1) && !v.inTriangleP(rt.p2) && v.inTriangleP(rt.p3) && !v.inTriangleP(rt.p4)) {
        return 13;
      }
      //1 точка треугольника в квадрате, остальные - вне, над треугольником
      if( (Y(rt.p1) >= Y(ta.p1)) && (Y(rt.p4) > Y(ta.p3)) && !v.inTriangleP(rt.p1) && !v.inTriangleP(rt.p4) && v.inRectangleP(ta.p1) ) {
        return 14;
      }
      //Прямоугольник горизонтально захватывает часть треугольника, не входя в него точками
      if( (X(rt.p1) < X(ta.p1)) && (Y(rt.p1) < Y(ta.p1)) && (Y(rt.p4) >= Y(ta.p3)) && !v.inTriangleP(rt.p1) && !v.inTriangleP(rt.p4) ){
        return 15;
      }
      //Прямоугольник горизонтально захватывает часть треугольника, входя в него лишь одной точкой
      if( (Y(rt.p1) < Y(ta.p1)) && (Y(rt.p4) >= Y(ta.p3)) && !v.inTriangleP(rt.p1) && !v.inTriangleP(rt.p2) && !v.inTriangleP(rt.p3) && v.inTriangleP(rt.p4) ){
        return 16;
      }
      //Прямоугольник горизонтально захватывает 2 точки треугольника, не входя в него
      if( (Y(rt.p4) < Y(ta.p3)) && !v.inTriangleP(rt.p1) && !v.inTriangleP(rt.p4) && v.inRectangleP(ta.p2) && v.inRectangleP(ta.p3)) {
        return 17;
      }
      //Прямоугольник вертикально захватывает 2 точки треугольника, не входя в него
      if( (X(rt.p1) <= X(ta.p1)) && (X(rt.p4) < X(ta.p3)) && !v.inTriangleP(rt.p1) && !v.inTriangleP(rt.p4) && v.inRectangleP(ta.p1) && v.inRectangleP(ta.p2)){
        return 18;
      }
      //Прямоугольник вертикально паересекает треугольник не входя в него
      if( (Y(rt.p4) < Y(ta.p3)) && (X(rt.p1) > X(ta.p1)) && (X(rt.p4) < X(ta.p3)) && !v.inTriangleP(rt.p1) && !v.inTriangleP(rt.p4) ){
        return 19;
      }
      //Правый нижний угол прямоугольника в треугольнике
      if( (Y(rt.p1) >= Y(ta.p1)) && !v.inTriangleP(rt.p1) && !v.inTriangleP(rt.p2) && !v.inTriangleP(rt.p3) && v.inTriangleP(rt.p4) ) {
        return 20;
      }
      //Два верхних угла прямоугольника вне треугольника
      if( (Y(rt.p4) >= Y(ta.p3)) && !v.inTriangleP(rt.p1) && !v.inTriangleP(rt.p2) && v.inTriangleP(rt.p3) && v.inTriangleP(rt.p4)) {
        return 21;
      }
      //Нижний угол треугольника в прямоугольнике, ни один угол прямоугольника не входит в треугольник
      if( !v.inTriangleP(rt.p1) && !v.inTriangleP(rt.p2) && !v.inTriangleP(rt.p3) && !v.inTriangleP(rt.p4) && v.inRectangleP(ta.p3)) {
        return 22;
      }
      //Нижний левый угол треугольника в прямоугольнике. Ни один угол прямоугольника не входит в треугольник
      if( (Y(rt.p4) < Y(ta.p3)) && v.inRectangleP(ta.p2) && !v.inTriangle(rt.p1) && !v.inTriangle(rt.p2) && !v.inTriangle(rt.p4) ) {
        return 23;
      }
      return 1;
    },
    calculateForMethod: function(method) {
      rt = v.rectCords;
			ta = v.triangleCords;
      rtArea = Math.abs(rt.p1[0]-rt.p4[0])*Math.abs(rt.p1[1]-rt.p4[1]);
      taArea = (Math.abs(ta.p1[0]-ta.p3[0])*Math.abs(ta.p1[1]-ta.p3[1]))/2;
      switch (method) {
        case 1:
          sRt = rtArea;
          break;
        case 2:
          sRt = rtArea - taArea;
          break;
        case 3:
          sRt = 0;
          break;
        case 4:
          sRt = rtArea;
          break;
        case 6:
          sRt = rtArea-v.sq([rt.p4,[X(ta.p1), Y(rt.p4)],[X(ta.p1), Y(rt.p1)],rt.p2]);
          break;
        case 7:
          sRt = rtArea-v.sq([rt.p2, [X(ta.p2), Y(rt.p2)], ta.p2, [X(rt.p2), Y(ta.p2)]]);
          break;
        case 8:
          sRt = rtArea-v.sq([rt.p1, [X(rt.p1), Y(ta.p3)], [X(rt.p2), Y(ta.p3)], rt.p2]);
          break;
        case 9:
          sRt = rtArea-v.sq([[X(rt.p2), v.serchPosYInLine(ta.p1, ta.p3, X(rt.p2))],
                             [X(rt.p2), Y(ta.p3)], [X(rt.p1), Y(ta.p3)], rt.p1,
                             [v.serchPosXInLine(ta.p1, ta.p3, Y(rt.p2)), Y(rt.p2)]]);
          break;
        case 10:
          sRt = rtArea-v.sq([rt.p1, [v.serchPosXInLine(ta.p1, ta.p3, Y(rt.p1)), Y(rt.p1)],
                             ta.p3, [X(rt.p1), Y(ta.p3)]]);
          break;
        case 11:
          sRt = v.sq([rt.p2, [X(rt.p2), v.serchPosYInLine(ta.p1, ta.p3, X(rt.p2))],
                      [v.serchPosXInLine(ta.p1, ta.p3, Y(rt.p2)), Y(rt.p2)]]);
          break;
        case 12:
          sRt = v.sq([rt.p2, rt.p4, [v.serchPosXInLine(ta.p1, ta.p3, Y(rt.p4)), Y(rt.p4)],
                      [v.serchPosXInLine(ta.p1, ta.p3, Y(rt.p2)), Y(rt.p2)]]);
          break;
        case 13:
          sRt = rtArea-v.sq([rt.p3, [X(rt.p3), v.serchPosYInLine(ta.p1, ta.p3, X(rt.p3))],
                             [v.serchPosXInLine(ta.p1, ta.p3, Y(rt.p3)), Y(rt.p3)]]);
          break;
        case 14:
          sRt = rtArea-v.sq([ta.p1, [X(ta.p1), Y(rt.p4)], [v.serchPosXInLine(ta.p1, ta.p3, Y(rt.p4)) ,Y(rt.p4)]]);
          break;
        case 15:
          sRt = rtArea-v.sq([[X(ta.p1), Y(rt.p1)],[X(ta.p1), Y(rt.p4)],
                             [v.serchPosXInLine(ta.p1, ta.p3, Y(rt.p4)), Y(rt.p4)],
                             [v.serchPosXInLine(ta.p1, ta.p3, Y(rt.p1)), Y(rt.p1)]]);
          break;
        case 16:
          sRt = rtArea-v.sq([[X(ta.p1), Y(rt.p1)],[X(ta.p1), Y(rt.p4)],
                              rt.p4, [X(rt.p4), v.serchPosYInLine(ta.p1, ta.p3, X(rt.p4))],
                              [v.serchPosXInLine(ta.p1, ta.p3, Y(rt.p1)), Y(rt.p1)]]);
          break;
        case 17:
          sRt = rtArea-v.sq([[X(ta.p1), Y(rt.p1)], ta.p2, ta.p3, [v.serchPosXInLine(ta.p1, ta.p3, Y(rt.p1)),Y(rt.p1)]]);
          break;
        case 18:
          sRt = rtArea-v.sq([ta.p1, ta.p2, [X(rt.p4), Y(ta.p2)], [X(rt.p4), v.serchPosYInLine(ta.p1, ta.p3, X(rt.p4))]]);
          break;
        case 19:
          sRt = rtArea-v.sq([[X(rt.p1), v.serchPosYInLine(ta.p1, ta.p3, X(rt.p1))],
                             [X(rt.p1), Y(ta.p3)], [X(rt.p4), Y(ta.p3)],
                             [X(rt.p4), v.serchPosYInLine(ta.p1, ta.p3, X(rt.p4))]]);
          break;
        case 20:
          sRt = rtArea-v.sq([ta.p1,[X(ta.p1), Y(rt.p4)], rt.p4, [X(rt.p4),v.serchPosYInLine(ta.p1, ta.p3, X(rt.p4))]]);
          break;
        case 21:
          sRt = rtArea-v.sq([rt.p3, rt.p4, [X(rt.p4), v.serchPosYInLine(ta.p1, ta.p3, X(rt.p4))],
                             [X(rt.p3), v.serchPosYInLine(ta.p1, ta.p3, X(rt.p3))] ]);
          break;
        case 22:
          sRt = rtArea-v.sq([[X(rt.p1), v.serchPosYInLine(ta.p1, ta.p3, X(rt.p1))], ta.p3, [X(rt.p1), Y(ta.p3)]]);
          break;
        case 23:
          sRt = rtArea-v.sq([[X(ta.p1), Y(rt.p1)], ta.p2, [X(rt.p4), Y(ta.p3)], [X(rt.p4), v.serchPosYInLine(ta.p1, ta.p3, X(rt.p4))],
                             [v.serchPosXInLine(ta.p1, ta.p3, Y(rt.p1)),Y(rt.p1)]]);
          break;
        default:
          sRt = '{Method: '+method+'}';
      }
      return rtArea - sRt;
    }
  },
  created: function() {

  }
});

//GoogleChart
function getFiguresCoordinatesFromCoordinatesForms() {
  rt = v.rectCords;
  tt = v.triangleCords;
  return {
    rectangle: {
      x: [
        rt.p1[0],
        rt.p4[0],
      ],
      y: [
        rt.p1[1],
        rt.p4[1],
      ]
    },
    triangle: {
      x: [
        tt.p1[0],
        tt.p3[0],
      ],
      y: [
        tt.p1[1],
        tt.p3[1],
      ]
    }
  };
}

function drawChart(coordinates) {
  if (coordinates) {
    getLineChart().draw(
      getLineChartDataFromCoordinates(coordinates),
      getLineChartOptions()
    );
  } else {
    let data = new google.visualization.DataTable();
    data.addColumn('number', '');
    data.addColumn('number', '');
    data.addColumn('number', '');
    getLineChart().draw(
      data,
      getLineChartOptions()
    );
  }
}

function getLineChart() {
  return new google.visualization.LineChart(
    document.getElementById('chart_div')
  );
}

function getLineChartDataFromCoordinates(coordinates) {
  var data = new google.visualization.DataTable();

  data.addColumn('number', '');
  data.addColumn('number', '');
  data.addColumn('number', '');
  data.addColumn('number', '');//Fix resize

  let rect = v.rectCords;
  let trian = v.triangleCords;

  //Fix resize
  minRectX = rect.p1[0] < rect.p4[0]?rect.p1[0]:rect.p4[0];
  maxRectX = rect.p1[0] > rect.p4[0]?rect.p1[0]:rect.p4[0];
  minRectY = rect.p1[1] < rect.p4[1]?rect.p1[1]:rect.p4[1];
  maxRectY = rect.p1[1] > rect.p4[1]?rect.p1[1]:rect.p4[1];

  minTrianX = trian.p1[0] < trian.p3[0]?trian.p1[0]:trian.p3[0];
  maxTrianX = trian.p1[0] > trian.p3[0]?trian.p1[0]:trian.p3[0];
  minTrianY = trian.p1[1] < trian.p3[1]?trian.p1[1]:trian.p3[1];
  maxTrianY = trian.p1[1] > trian.p3[1]?trian.p1[1]:trian.p3[1];

  minX = minRectX <= minTrianX?minRectX:minTrianX;
  maxX = maxRectX >= maxTrianX?maxRectX:maxTrianX;
  minY = minRectY <= minTrianY?minRectY:minTrianY;
  maxY = maxRectY >= maxTrianY?maxRectY:maxTrianY;

  max = maxX >= maxY?maxX:maxY;
  min = minX <= minY?minX:minY;
  v.pickedSize = 10;
  if(v.pickedSize != 'auto') {
    min = 0;
    max = Number(v.pickedSize);
  }
  //EndFix

  rows = [
		[Number(rect.p1[0]), Number(rect.p1[1]), null, null],
		[Number(rect.p2[0]), Number(rect.p2[1]), null, null],
		[Number(rect.p4[0]), Number(rect.p4[1]), null, null],
		[Number(rect.p3[0]), Number(rect.p3[1]), null, null],
		[Number(rect.p1[0]), Number(rect.p1[1]), null, null],

		[Number(trian.p1[0]), null, Number(trian.p1[1]), null],
		[Number(trian.p2[0]), null, Number(trian.p2[1]), null],
		[Number(trian.p3[0]), null, Number(trian.p3[1]), null],
		[Number(trian.p1[0]), null, Number(trian.p1[1]), null],

		[min, null, null, min],
		[max, null, null, max]
  ];

  data.addRows(rows);

  return data;
}

function getLineChartOptions() {
  c = {
    height: '500',
    width: '500',
    chartArea: {
      width: '80%',
      height: '80%'
    },
    hAxis: {
      gridlines: {
        count: 10
      },
      viewWindow:{
          max:'auto',
          min:'auto'
      }
    },
    vAxis: {
      gridlines: {
        count: 10
      },
      viewWindow:{
          max:'auto',
          min:'auto'
      }
    },
    series: {
      0: {
        lineWidth: 5
      },
      1: {
        lineWidth: 5
      }
    },
    legend: {
      position: "none"
    },
    colors: ["#1565c0", "#1da61e", "transparent"]
  };
  //SelectedSize
  if(v.pickedSize != 'auto') {
    c.hAxis['viewWindow'].min = v.pickedSize*-1;
    c.hAxis['viewWindow'].max = v.pickedSize;

    c.vAxis['viewWindow'].min = v.pickedSize*-1;
    c.vAxis['viewWindow'].max = v.pickedSize;
  }
  //End SelectedSize
  return c;
}
