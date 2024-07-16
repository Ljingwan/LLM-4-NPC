<script lang="ts" setup>
import { ref, reactive, defineProps, onMounted, watch } from "vue";
import usePromptInfoStore from "@/stores/prompt"; //引入仓库
import { storeToRefs } from "pinia"; //引入pinia转换
const promptInfo = usePromptInfoStore();

const { promptListStore } = storeToRefs(promptInfo); // 响应式

// props 接收父组件参数
const props = defineProps({
  dialogVisible: Boolean,
});
const dialogIsShow = ref(false);
const innerDialogIsShow = ref(false);

// 监听状态改变
watch(
  () => props.dialogVisible,
  (val) => {
    dialogIsShow.value = val;
  }
);

// 弹窗关闭的时候 传状态给父组件
const emit = defineEmits<{
  changeVi: [dialogIsShow: boolean];
  submit: [promptList: Object];
}>();

const closeDialog = () => {
  emit("submit", promptList);
  emit("changeVi", false);
};

const promptForm = reactive({
  name: "",
  desc: "",
});

let promptList: Object[] = reactive([]);
const submitPrompt = () => {
  let promptData = { name: "", desc: "" };
  promptData.name = promptForm.name;
  promptData.desc = promptForm.desc;
  promptList.push(promptData);
  promptForm.name = "";
  promptForm.desc = "";
  innerDialogIsShow.value = false;
  //   emit("submit", promptForm);
  //   emit("changeVi", false);
};

onMounted(() => {
  promptList = promptListStore.value;
});
</script>
<template>
  <div class="prompt-form">
    <div class="form-wrapper">
      <!-- 外层dialog -->
      <el-dialog
        :model-value="props.dialogVisible"
        title="Prompt List"
        width="700"
        @close="closeDialog"
      >
        <el-table :data="promptList">
          <el-table-column property="name" label="Name" width="150" />
          <el-table-column property="desc" label="Description" width="500" />
        </el-table>
        <!-- 内层 -->
        <el-dialog
          :model-value="innerDialogIsShow"
          title="Add Prompt"
          width="500"
        >
          <el-form
            :model="promptForm"
            label-width="auto"
            style="max-width: 600px"
          >
            <el-form-item label="Character Name">
              <el-input v-model="promptForm.name" />
            </el-form-item>
            <el-form-item label="Character Description">
              <el-input type="textarea" rows="10" v-model="promptForm.desc" />
            </el-form-item> </el-form
          ><template #footer>
            <div class="dialog-footer">
              <el-button @click="innerDialogIsShow = false">Cancel</el-button>
              <el-button type="primary" @click="submitPrompt">
                Submit
              </el-button>
            </div>
          </template></el-dialog
        >

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="closeDialog">Cancel</el-button>
            <!-- <el-button type="primary" @click="submitPrompt">
              Confirm
            </el-button> -->
            <el-button type="primary" @click="innerDialogIsShow = true">
              Add Prompt
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.prompt-form {
  background-color: #fff;
  padding: 20px;
  .form-wrapper {
  }
}
</style>
