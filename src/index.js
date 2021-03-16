import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset'
import styled from 'styled-components'
import { DragDropContext } from 'react-beautiful-dnd'
import initialData from './initial-data'
import Column from './Column'

const Container = styled.div`
  display: flex;
`

class App extends React.Component {
  state = initialData

  onDragEnd = result => {
    const { draggableId, source, destination } = result

    // destination: ドロップ先 がない場合には処理を終了
    if (!destination) {
      return
    }

    // ドロップ前後のIDが同じで、ドロップ前後のindexが同じ場合には処理を終了
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const start = this.state.columns[source.droppableId] // 開始時のカラムを取得
    const finish = this.state.columns[destination.droppableId] // 終了時のカラムを取得

    if (start === finish) {  // 開始時のカラムと終了時のカラムが同じであれば実行
      const newTasksIds = Array.from(start.taskIds) // columnからstartに書き換え
      newTasksIds.splice(source.index, 1)
      newTasksIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start, // columnからstartに書き換え 
        taskIds: newTasksIds,
      }

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        },
      }

      this.setState(newState)
      return
    }
    
    // 開始カラムと終了カラムが違い場合の処理
    const startTasksIds = Array.from(start.taskIds) // 開始時のカラムからタスクのidを取得
    startTasksIds.splice(source.index, 1) // draggableなコンポーネントが元あった場所から1つ配列を削除する
    const newStart = {
      ...start, // 開始時のカラムをコピー
      taskIds: startTasksIds, // taskIdsの値をstartTaskIdsに置き換える
    }

    const finishTasksIds = Array.from(finish.taskIds) // 終了時のカラムからタスクのidを取得
    finishTasksIds.splice(destination.index, 0, draggableId) // draggableなコンポーネントが置かれた場所にdraggableなコンポーネントを追加する
    const newFinish = {
      ...finish, // 終了時のカラムをコピー
      taskIds: finishTasksIds, // taskIdsの値をfinishTaskIdsに置き換える
    }

    const newState = {
      ...this.state, // stateをコピー
      columns: { 
        ...this.state.columns, // columnsをコピー
        [newStart.id]: newStart,  // start時のid: {id: start時のid, title: 'start時のtitle', taskIds: 'start時のids'}
        [newFinish.id]: newFinish, // finish時のid: {id: finish時のid, title: 'finish時のtitle', taskIds: 'finish時のids'}
      }
    }

    this.setState(newState) //stateの更新→再レンダリング
  }

  render() {
    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
      >
        <Container>
          {this.state.columnOrder.map(columnId => {
            const column = this.state.columns[columnId]
            const tasks = column.taskIds.map(taskId => this.state.tasks[taskId])

            return <Column key={column.id} column={column} tasks={tasks} />
          })}
        </Container>
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
