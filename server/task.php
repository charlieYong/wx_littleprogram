<?php

// 任务管理类
class TaskController {
    // 任务的结构
    /*
     * {
     *      date1 => [{id => int, title => string, content => string, isDone => boolean}, ...],
     *      date2 => [{id => int, title => string, content => string, isDone => boolean}, ...],
     *      ...
     * }
     */
    // 任务数据文件
    var $dataFilePath = "tasks.csv";
    // 任务列表
    var $taskList = array ();

    function TaskController () {
        $this->LoadTasksFromFile ();
    }

    function LoadTasksFromFile () {
        $data = file_get_contents ($this->dataFilePath);
        if (empty ($data)) {
            return;
        }
        $this->taskList = json_decode ($data, true);
    }

    function DumpTasksToFile () {
        file_put_contents ($this->dataFilePath, json_encode ($this->taskList));
    }

    // 创建一个任务
    public function NewTask ($date, $title, $content) {
        $id = 0;
        if (array_key_exists ($date, $this->taskList)) {
            $id = count($this->taskList[$date]);
        }
        return array (
            "id" => $id,
            "title" => $title,
            "content" => $content,
            "isDone" => false
        );
    }

    // 添加或修改任务
    public function UpdateTask ($date, $task) {
        if (!array_key_exists ($date, $this->taskList)) {
            $this->taskList[$date] = array ($task);
            // 更新到本地
            $this->DumpTasksToFile ();
            return;
        }
        $isUpdate = false;
        for ($i=0; $i<count($this->taskList[$date]); $i++) {
            if ($this->taskList[$date][$i]["id"] == $task["id"]) {
                $this->taskList[$date][$i] = $task;
                $isUpdate = true;
                break;
            }
        }
        if (!$isUpdate) {
            array_push ($this->taskList[$date], $task);
        }
        // 更新到本地
        $this->DumpTasksToFile ();
    }

    // 获取任务列表
    public function GetAllTasks () {
        return $this->taskList;
    }

    // 根据ID获取任务
    public function GetTaskByID ($date, $id) {
        if (!array_key_exists ($date, $this->taskList)) {
            return null;
        }
        for ($i=0; $i<count($this->taskList[$date]); $i++) {
            if ($this->taskList[$date][$i]["id"] == intval ($id)) {
                return $this->taskList[$date][$i];
            }
        }
        return null;
    }
}

/*
// test
$t = new taskController ();
$t->UpdateTask ("20161011", $t->NewTask ("20161011", "title", "content"))
*/

function main () {
    $ret = array (
        "data" => array (),
        "error" => "",
    );
    if (!isset ($_GET["type"])) {
        $ret["error"] = "请指定请求内容";
        echo json_encode ($ret);
        return;
    }
    $mgr = new taskController ();
    switch ($_GET["type"]) {
    case "get":
        HandleGetAllTasks ($mgr, $ret);
        break;
    case "add":
        HandleAddTask ($mgr, $ret);
        break;
    case "delete":
        break;
    case "update":
        HandleUpdateTask ($mgr, $ret);
        break;
    default:
        $ret["error"] = "不支持的请求类型";
        echo json_encode ($ret);
        return;
    }
}

// 获取任务数据接口
// task.php?type=get
function HandleGetAllTasks ($taskMgr, $ret) {
    $ret["data"] = $taskMgr->getAllTasks ();
    echo json_encode ($ret);
    return;
}

// 添加任务接口
// task.php?type=add
// post data: date=$date&title=$title&content=$content
function HandleAddTask ($taskMgr, $ret) {
    $post = json_decode (file_get_contents ("php://input"), true);
    if (empty ($post["date"]) || empty ($post["title"]) || empty ($post["content"])) {
        $ret["error"] = "参数不全";
        echo json_encode ($ret);
        return;
    }
    $task = $taskMgr->NewTask ($post["date"], $post["title"], $post["content"]);
    $taskMgr->UpdateTask ($post["date"], $task);
    $ret["data"] = $task;
    echo json_encode ($ret);
    return;
}

// 修改任务接口
// task.php?type=add
// post data: json string
function HandleUpdateTask ($taskMgr, $ret) {
    $post = json_decode (file_get_contents ("php://input"));
    if (empty ($post->date) || empty ($post->task)) {
        $ret["error"] = "参数不全";
        echo json_encode ($ret);
        return;
    }
    $task = $taskMgr->GetTaskByID ($post->date, $post->task->id);
    if (empty ($task)) {
        $ret["error"] = "需要更新的任务不存在，id=" . $post->task->id;
        echo json_encode ($ret);
        return;
    }
    $task["title"] = $post->task->title;
    $task["content"] = $post->task->content;
    $task["isDone"] = $post->task->isDone;
    $taskMgr->UpdateTask ($post->date, $task);
    $ret["data"] = $task;
    echo json_encode ($ret);
    return;
}

main ();

?>
