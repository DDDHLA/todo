// 待办事项数据
let todos = [];
let currentFilter = 'all';
let isDarkMode = false;

// DOM 元素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalCount = document.getElementById('totalCount');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');
const themeToggleBtn = document.getElementById('themeToggle');

// 初始化加载数据
async function init() {
  // 加载主题设置
  loadTheme();
  
  // 加载待办数据
  todos = await window.electronAPI.getTodos();
  renderTodos();
  updateStats();
}

// 保存数据
async function saveTodos() {
  await window.electronAPI.saveTodos(todos);
}

// 添加待办事项
function addTodo() {
  const text = todoInput.value.trim();
  if (text === '') return;

  const todo = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString()
  };

  todos.unshift(todo);
  todoInput.value = '';
  saveTodos();
  renderTodos();
  updateStats();
}

// 切换完成状态
function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
    updateStats();
  }
}

// 删除待办事项
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
  updateStats();
}

// 编辑待办事项
function editTodo(id, newText) {
  const todo = todos.find(t => t.id === id);
  if (todo && newText.trim() !== '') {
    todo.text = newText.trim();
    saveTodos();
    renderTodos();
  }
}

// 清除已完成
function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  renderTodos();
  updateStats();
}

// 过滤待办事项
function getFilteredTodos() {
  switch (currentFilter) {
    case 'active':
      return todos.filter(t => !t.completed);
    case 'completed':
      return todos.filter(t => t.completed);
    default:
      return todos;
  }
}

// 渲染待办事项列表
function renderTodos() {
  const filteredTodos = getFilteredTodos();
  
  if (filteredTodos.length === 0) {
    todoList.innerHTML = '<li class="empty-state">暂无待办事项</li>';
    return;
  }

  todoList.innerHTML = filteredTodos.map(todo => `
    <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
      <input 
        type="checkbox" 
        class="todo-checkbox" 
        ${todo.completed ? 'checked' : ''}
        onchange="toggleTodo(${todo.id})"
      >
      <span class="todo-text" ondblclick="startEdit(${todo.id})">${escapeHtml(todo.text)}</span>
      <button class="btn-delete" onclick="deleteTodo(${todo.id})">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </li>
  `).join('');
}

// 开始编辑
function startEdit(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  const item = document.querySelector(`[data-id="${id}"]`);
  const textSpan = item.querySelector('.todo-text');
  
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'todo-edit';
  input.value = todo.text;
  
  textSpan.replaceWith(input);
  input.focus();
  input.select();

  function finishEdit() {
    const newText = input.value.trim();
    if (newText !== '') {
      editTodo(id, newText);
    } else {
      renderTodos();
    }
  }

  input.addEventListener('blur', finishEdit);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      finishEdit();
    }
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      renderTodos();
    }
  });
}

// 更新统计
function updateStats() {
  totalCount.textContent = todos.length;
  activeCount.textContent = todos.filter(t => !t.completed).length;
  completedCount.textContent = todos.filter(t => t.completed).length;
}

// HTML 转义
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 主题切换
function toggleTheme() {
  isDarkMode = !isDarkMode;
  applyTheme();
  saveTheme();
}

// 应用主题
function applyTheme() {
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

// 保存主题到本地存储
function saveTheme() {
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// 加载主题
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  isDarkMode = savedTheme === 'dark';
  applyTheme();
}

// 事件监听
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

themeToggleBtn.addEventListener('click', toggleTheme);

// 初始化
init();
