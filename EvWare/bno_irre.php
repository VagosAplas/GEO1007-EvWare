<!DOCTYPE HTML>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Building Occupancy</title>
  <script type="text/javascript" src="lib/canvasjs.min.js"></script>
  <script type="text/javascript">
  window.onload = function () {
    <?php
       $conn=pg_connect("host=localhost dbname=synthesis port=5432 user=postgres password=xyq7799srr")
       or die("connection failed.");
       $bno =$_POST["bno"];
       $result1 = pg_query($conn, "SELECT reg_occu FROM ir_re_bno where bno = '$bno' order by week");
       $result2 = pg_query($conn, "SELECT irre_occu FROM ir_re_bno where bno = '$bno' order by week");
       $c = pg_fetch_all_columns($result1);
       $d = pg_fetch_all_columns($result2);
       $tempa = "var data1 = Array(";
       for ($x=0;$x<=8;$x++){$tempa.=($c[$x].",");}
       for ($x=0;$x<=7;$x++){$tempa.=($d[$x].",");}
       $tempa.=$d[8];
       $tempa.=(")");
       echo $tempa;
?>,
    chart = new CanvasJS.Chart("chartContainer",
    {
      title:{
      text: "Occupancy of <?php $result3=pg_query($conn, "SELECT b_name FROM wt3_building where bno = '$bno'");
                                         $b=pg_fetch_row($result3);
                                         echo $b[0]; ?>"   
      },
      axisY:{
        title:"users"   
      },
      animationEnabled: true,
      data: [
      {        
        type: "stackedColumn",
        toolTipContent: "{label}<br/><span style='\"'color: {color};'\"'>{name}</span>: {y}",
        name: "Regular hours",
        showInLegend: "true",
        dataPoints: [
        {  y: data1[0] , label: "week 13"},
        {  y: data1[1], label: "week 14" },
        {  y: data1[2], label: "week 15" },
        {  y: data1[3], label: "week 16" },
        {  y: data1[4], label: "week 17"},
        {  y: data1[5], label: "week 18"},
        {  y: data1[6], label: "week 19"},
        {  y: data1[7], label: "week 20"},
        {  y: data1[8], label: "week 21"} 
        ]
      },  {        
        type: "stackedColumn",
        toolTipContent: "{label}<br/><span style='\"'color: {color};'\"'><strong>{name}</strong></span>: {y}",
        name: "Irregular hours",
        showInLegend: "true",
        dataPoints: [
        {  y: data1[9], label: "week 13"},
        {  y: data1[10], label: "week 14" },
        {  y: data1[11], label: "week 15" },
        {  y: data1[12], label: "week 16" },
        {  y: data1[13], label: "week 17"},
        {  y: data1[14], label: "week 18"},
        {  y: data1[15], label: "week 19"},
        {  y: data1[16], label: "week 20"},
        {  y: data1[17], label: "week 21"}
        ]
      }            
      ]
      ,
      legend:{
        cursor:"pointer",
        itemclick: function(e) {
          if (typeof (e.dataSeries.visible) ===  "undefined" || e.dataSeries.visible) {
	          e.dataSeries.visible = false;
          }
          else
          {
            e.dataSeries.visible = true;
          }
          chart.render();
        }
      }
    });

    chart.render();
  }
    
</script>

</head>
<body>
<div id="chartContainer" style="height: 200px; width: 100%"></div>
</body>
</html>