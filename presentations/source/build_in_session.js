var authorFs = await import('node:fs/promises');
// Replace this placeholder with the local checkout path before running in an
// empty Artifact Session. Session model handles remain callback scoped.
var rootDir = '__PROJECT_ROOT__';
var deckData = JSON.parse(await authorFs.readFile(rootDir + '/presentations/source/slides.json', 'utf8'));
await artifactSession.run(async ({ presentation, session }) => {
  if (presentation.slides.items.length) throw new Error('Expected an empty presentation. Use a focused edit for an existing deck.');
  const W = 1280, H = 720, FONT = 'Arial Unicode MS';
  const C = { bg: '#FAF8F2', ink: '#142D3D', teal: '#087C7A', gray: '#536572', soft: '#F0F1EC', white: '#FFFFFF' };
  function text(slide, str, x, y, w, h, size=28, color=C.ink, bold=false, name='') {
    const sh = slide.shapes.add({ name, geometry: 'textbox', position: { left:x, top:y, width:w, height:h }, fill:'none', line:{fill:'none',width:0} });
    sh.text = str;
    sh.text.style = { typeface:FONT, fontSize:size, color, bold, wrap:'square', autoFit:'none', verticalAlignment:'top', insets:0 };
    return sh;
  }
  function table(slide, headers, rows, top=180, widths=null) {
    const vals=[headers,...rows], n=vals.length, m=headers.length;
    const h=54+rows.length*66;
    const tb=slide.tables.add({ rows:n, columns:m, left:64,top,width:1152,height:h,values:vals,columnWidths:widths || (m===2?[330,822]:[250,450,452]) });
    tb.borders.assign({style:'solid',fill:'#D6DFDD',width:0.7});
    for(let i=0;i<n;i++) {
      tb.rows[i].height=i===0?54:66;
      for(let j=0;j<m;j++) {
        const ce=tb.getCell(i,j);ce.fill=i===0?C.ink:(i%2===0?C.soft:C.white);
        ce.text.style={typeface:FONT,fontSize:23,color:i===0?C.white:C.ink,bold:i===0,verticalAlignment:'middle',wrap:'square',autoFit:'none',insets:{left:12,right:12,top:6,bottom:6}};
      }
    }
    return tb;
  }
  async function image(slide, file, x,y,w,h,fit='contain') {
    const b=await authorFs.readFile(rootDir+'/presentations/assets/'+file);
    slide.images.add({dataUrl:'data:image/png;base64,'+b.toString('base64'),contentType:'image/png',alt:file,fit,position:{left:x,top:y,width:w,height:h}});
  }
  for (let i=0;i<deckData.length;i++) {
    const d=deckData[i], slide=presentation.slides.add({width:W,height:H});
    slide.background.fill=C.bg;
    if(d.kind==='cover') {
      await image(slide,'cover_network.png',0,0,W,H,'cover');
      text(slide,d.title,64,142,750,194,64,C.ink,true,'deck-title');
      text(slide,d.subtitle,68,382,670,60,32,C.teal,false,'subtitle');
      text(slide,d.date,68,506,650,36,23,C.gray);
    } else {
      text(slide,d.title,64,48,1152,70,44,C.ink,true,'slide-title');
      if(d.meta)text(slide,d.meta,66,127,1140,34,23,C.gray);
      if(d.kind==='table') {
        if(d.intro)text(slide,d.intro,66,133,1140,38,27,C.gray);
        let widths=d.headers.length===2?[306,846]:d.title.includes('六篇')?[280,360,512]:d.title.includes('使用方式')?[345,365,442]:d.title.includes('RE-GCN 与')?[260,446,446]:d.title.includes('粒度')?[240,492,420]:d.title.includes('三个关键')?[280,440,432]:[250,450,452];
        table(slide,d.headers,d.rows,d.intro?194:180,widths);
      } else if(d.kind==='method' || d.kind==='comparison') {
        text(slide,d.leftTitle,64,188,550,50,31,C.teal,true);
        text(slide,d.rightTitle,686,188,530,50,31,C.teal,true);
        for(let k=0;k<d.left.length;k++)text(slide,d.left[k],64,266+k*83,550,70,29);
        for(let k=0;k<d.right.length;k++)text(slide,d.right[k],686,266+k*83,530,70,29);
        if(d.caveat)text(slide,d.caveat,64,637,1152,34,23,C.gray);
      } else if(d.kind==='figure') {
        await image(slide,d.image,64,181,1152,330);
        text(slide,d.imageCaption,66,521,1140,30,20,C.gray);
        for(let k=0;k<d.bottom.length;k++)text(slide,d.bottom[k],64+k*610,568,550,66,26);
      } else if(d.kind==='questions') {
        for(let k=0;k<d.items.length;k++) {
          const [n,label,q]=d.items[k],y=156+k*68;
          text(slide,n,64,y,80,56,34,C.teal,true);
          text(slide,label,160,y+2,240,48,29,C.ink,true);
          text(slide,q,404,y+2,812,56,28);
        }
      } else if(d.kind==='summary') {
        for(let k=0;k<d.items.length;k++) {
          text(slide,d.items[k][0],64,184+k*92,200,56,34,C.teal,true);
          text(slide,d.items[k][1],286,188+k*92,930,72,30);
        }
      } else if(d.kind==='references') {
        for(let k=0;k<d.entries.length;k++) {
          const [label,cite,url]=d.entries[k], y=166+k*157;
          text(slide,label,64,y,1100,34,27,C.teal,true);
          text(slide,cite,64,y+42,1152,72,25);
          const link=text(slide,url.replace('https://',''),64,y+112,1152,30,20,C.gray);
          link.text.get(url.replace('https://','')).link={uri:url,isExternal:true};
        }
      }
      if(d.takeaway && d.kind!=='figure')text(slide,d.takeaway,64,d.kind==='questions'?601:586,1152,d.caveat?42:70,28,C.teal,true,'takeaway');
      if(d.takeaway && d.kind==='figure')text(slide,d.takeaway,64,644,1152,34,23,C.teal,true,'takeaway');
      text(slide,String(i+1).padStart(2,'0'),1162,685,54,22,16,C.gray);
    }
    slide.speakerNotes.text=d.notes+(d.sources.length?'\n\n来源\n'+d.sources.join('\n'):'\n\n说明：本页为调研综合判断或待确认的项目访谈建议。');
  }
  nodeRepl.write({slideCount:presentation.slides.items.length,font:FONT,size:[W,H],status:'authored'});
}, {artifactType:'presentation'});
