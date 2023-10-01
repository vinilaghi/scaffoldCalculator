import { useState, useRef } from 'react'
import {EuiFilePicker, EuiButton, EuiText, EuiSpacer} from '@elastic/eui'
import { cloneDeep } from 'lodash'

const ScaffoldList = () => {
    const filePickerRef = useRef();

    const [scaffoldList, setScaffoldList] = useState([])
    const [currentFile, setCurrentFile] = useState([])

    

    const onClick = () => {
        let tempList = cloneDeep(scaffoldList)
        const fileReader = new FileReader();
        fileReader.readAsText(currentFile[0], "UTF-8");
        fileReader.onload = e => {
            let jsonFile = JSON.parse(e.target.result)
            let tempIdList = {};
            let qlen;
            let qseqid;
            jsonFile.Sheet1.forEach(scaffold => {
                if (!qlen) {
                    qlen = scaffold.qlen
                }
                if (!qseqid) {
                    qseqid = scaffold.qseqid
                }
                if (!tempIdList[scaffold.scaffold_id]) {
                  tempIdList[scaffold.scaffold_id] = {}
                  tempIdList[scaffold.scaffold_id][scaffold.sframe] = []
                  tempIdList[scaffold.scaffold_id][scaffold.sframe].push({qstart: scaffold.qstart, qend: scaffold.qend, qframe: scaffold.qframe})
                  } else {
                    if (tempIdList[scaffold.scaffold_id][scaffold.sframe]) {
                        tempIdList[scaffold.scaffold_id][scaffold.sframe].push({qstart: scaffold.qstart, qend: scaffold.qend, qframe: scaffold.qframe})
                    } else {
                        tempIdList[scaffold.scaffold_id][scaffold.sframe] = []
                        tempIdList[scaffold.scaffold_id][scaffold.sframe].push({qstart: scaffold.qstart, qend: scaffold.qend, qframe: scaffold.qframe})
                    }
                  }
            })

            Object.keys(tempIdList).forEach(key => {
                let newScaffold = key;
                tempList.push('')
                let tempFrameResults = []
  

                    Object.keys(tempIdList[key]).forEach(frame => {
                        
                            tempIdList[key][frame].forEach(item => {
                                item.qstart = parseInt(item.qstart);
                                item.qend = parseInt(item.qend);
                            })
                            let tempResults = 0
                            if (parseInt(tempIdList[key][frame][0].qframe) > 0) {
                               
                                let tempFrames = cloneDeep(tempIdList[key][frame])
                                
                                tempFrames.sort((a, b) => {
                                    return a.qstart - b.qstart;
                                });
                                tempFrames.forEach((item, index) => {
            
                                    if (parseInt(frame) === -2 && newScaffold === 'scaffold14') {
                                        // debugger;
                                    }
                                    if (index < tempFrames.length -1) {
                                        let tempNumber = index +1;
                                        if (item.qend >= tempFrames[tempNumber].qstart){
                                            tempFrames[tempNumber].qstart = item.qend +1
                                        }
                                    }
                                    
                                    let tempValue = item.qend - item.qstart;
                                    tempResults +=  tempValue
                                })
                            } else {
                                let tempFrames = cloneDeep(tempIdList[key][frame])
                                tempFrames.sort((a, b) => {
                                    return a.qend - b.qend;
                                });
        
                                tempFrames.forEach((item, index) => {
                                    if (index < tempFrames.length -1) {
                                        let tempNumber = index +1;
        
                                        if (item.qstart >= tempFrames[tempNumber].qend){
                                            tempFrames[tempNumber].qend = item.qstart +1
                                        }
                                    }
                                    let tempValue = item.qstart - item.qend;
                                    tempResults +=  tempValue
                                    
                                })
                            }
                            tempFrameResults.push({frame: frame, cover: ((tempResults / qlen)*100).toFixed(2)})
                    })
                    tempFrameResults.sort((a, b) => {
                        return parseInt(a.frame) - parseInt(b.frame);
                    });
                    tempFrameResults.forEach(item => {
                        tempList.push('Em ' + qseqid + ' o frame ' + item.frame + ' do ' + newScaffold + ' tem uma cobertura de ' + item.cover)
                    })
                    
                

              });

         
          setScaffoldList(tempList);
          filePickerRef.current.removeFiles()
        };
    }
    const onChange = (files) => {
        setCurrentFile(files.length > 0 ? Array.from(files) : []);
      };

     

  return (
    <>
    <div style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <EuiFilePicker onChange={onChange} ref={filePickerRef} id='filePickerID' display='large' />

    </div>
    <EuiButton disabled={currentFile.length === 0} onClick={() => {onClick()}}> Calculate</EuiButton>
    {scaffoldList.map(e => { return  e? <EuiText>{e}</EuiText> : <EuiSpacer />})}

    </>
  )
}

export default ScaffoldList
