import React, { Component } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';

class TodoList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            itemRefs: new Map()
        };
        this.removeTodoItem = this.removeTodoItem.bind(this);
        this.toggleCheckboxDisability = this.toggleCheckboxDisability.bind(this);
        this.checkAllParentTasks = this.checkAllParentTasks.bind(this);
        this.forceSetItemTodo = this.forceSetItemTodo.bind(this);
    }

    componentDidMount() {
        axios.get('/tasks', {
            params: {
                page: 1
            }
        }).then((response) => {
            let tasks = [];
            let refSet = new Map();
            for (let task of response.data.content) {
                tasks.push(<TodoItem id={task.id} content={task.content} status={task.status}
                                     createdAt={task.createdAt} updatedAt={task.updatedAt}
                                     parentTaskIds={task.parentTaskIds}
                                     removeTodoItem={this.removeTodoItem}
                                     addOrRemoveChosenTask={this.props.addOrRemoveChosenTask}
                                     toggleCheckboxDisability={this.toggleCheckboxDisability}
                                     checkAllParentTasks={this.checkAllParentTasks}
                                     toggleUpdateMode={this.props.toggleUpdateMode}
                                     forceSetItemTodo={this.forceSetItemTodo}
                                     key={Date.now() + task.id}
                                     ref={(el => refSet.set(task.id, el))}/>);
            }
            this.setState({items: tasks, itemRefs: refSet});

        }).catch(function (error) {
            console.log(error);
        }).then(function () {
            // always executed
        });
    }

    forceSetItemTodo(id) {
        if (this.state.itemRefs.has(id) && this.state.itemRefs.get(id) !== null) {
            this.state.itemRefs.get(id).toggleStatus();
        }
    }

    toggleCheckboxDisability(exceptId) {
        for(let id of this.state.itemRefs.keys()) {
            if(this.state.itemRefs.get(id) === null) continue;
            let todoItem = this.state.itemRefs.get(id);
            todoItem.toggleRemoveButtonDisability();
            todoItem.toggleModifyStatusDisability();
            if(id === exceptId) continue;
            todoItem.toggleModifyDisability();
            todoItem.taskChoosingCheckbox.toggleCheckboxDisabled();
        }
    }

    checkAllParentTasks(parentTaskIds) {
        for(let id of parentTaskIds){
            if (this.state.itemRefs.has(id) && this.state.itemRefs.get(id) !== null) {
                this.state.itemRefs.get(id).taskChoosingCheckbox.selectOrUnselectForParentTask();
            }
        }
    }

    removeTodoItem(id) {
        this.setState((prevState) => {
            return {
                items: prevState.items.filter(item => item.props.id !== id)
            };
        });
    }

    render() {
        var listStyle = {
            height: '83%',
            width: '100%',
            margin: 'auto',
            overflow: 'hidden',
            borderRadius: '5px',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        };

        return (
            <div style={listStyle}>
                {this.state.items}
            </div>
        );
    }
}

export default TodoList;