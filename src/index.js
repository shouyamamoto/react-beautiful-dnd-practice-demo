import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset'
import { DragDropContext } from 'react-beautiful-dnd'
import initialData from './initial-data'
import Column from './Column'


class App extends React.Component {
  state = initialData

  onDragEnd = result => {
    const { draggableId, source, destination } = result
    
    // destination: ドロップ先 がない場合には処理を終了
    if(!destination) {
      return
    }
    
    // ドロップ前後のIDが同じで、ドロップ前後のindexが同じ場合には処理を終了
    if(
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) { 
      return 
    }

    // dndした要素カラムIdから、元の場所にあったカラムを取得（state）
    const column = this.state.columns[source.droppableId]
    // taskIdsのコピー
    const newTasksIds = Array.from(column.taskIds)
    // 配列からドラックした要素から1つ削除する
    newTasksIds.splice(source.index, 1)
    // ドロップした場所に、ドロップした要素を追加する
    newTasksIds.splice(destination.index, 0, draggableId)
    
    // columnをコピーし、taskIdsを上書き
    const newColumn = {
      ...column, 
      taskIds: newTasksIds,
    }

    // stateをコピーし、columnsを上書き
    const newState = {
      ...this.state,
      columns: {
        [newColumn.id]: newColumn
      },
    } 

    // stateの更新
    this.setState(newState)
  }

  render() {
    return (
      <DragDropContext 
        onDragEnd={this.onDragEnd}
      >
      {this.state.columnOrder.map(columnId => {
        const column = this.state.columns[columnId]
        const tasks = column.taskIds.map(taskId => this.state.tasks[taskId])
        
        return <Column key={column.id} column={column} tasks={tasks} />
      })}
      </DragDropContext>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
