import React from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

const List = styled.li`
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid lightgray;
  border-radius: 2px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white' )};
`

export default class Task extends React.Component {
  render() {
    return(
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
      {(provided, snapshot) => (
        <List 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
        >
          {this.props.task.content}
        </List>
      )}
      </Draggable>
    )
  }
}