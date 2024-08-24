<script lang="ts" setup>
import { ref, reactive, defineProps, onMounted, watch } from "vue";
import usePromptInfoStore from "@/stores/prompt"; //引入仓库
import { storeToRefs } from "pinia"; //引入pinia转换
import { ElMessage, ElMessageBox } from "element-plus";

import type { UploadProps, UploadUserFile } from "element-plus";
const promptInfo = usePromptInfoStore();

const { promptListStore } = storeToRefs(promptInfo); // 响应式

// props 接收父组件参数
const props = defineProps({
  dialogVisible: Boolean,
});
const dialogIsShow = ref(false);
// const innerDialogIsShow = ref(false);

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
  submit: [promptForm: Object];
}>();

const closeDialog = () => {
  // emit("submit", promptForm);
  emit("changeVi", false);
};

const promptForm = reactive({
  name: "",
  desc: "",
});

// let promptList: Object[] = reactive([]);
const submitPrompt = () => {
  emit("submit", promptForm);
  emit("changeVi", false);
};

const fileList = ref<UploadUserFile[]>([
  {
    name: "Harry Potter.txt",
    url: "https://element-plus.org/images/element-plus-logo.svg",
  },
  // {
  //   name: "element-plus-logo2.svg",
  //   url: "https://element-plus.org/images/element-plus-logo.svg",
  // },
]);

const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
};

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  );
};

const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  );
};

onMounted(() => {
  promptForm.name = "";
  promptForm.desc = "";
});
</script>
<template>
  <div class="prompt-form">
    <div class="form-wrapper">
      <!-- 外层dialog -->
      <el-dialog
        :model-value="props.dialogVisible"
        title="Add Prompt"
        width="700"
        @close="closeDialog"
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
          </el-form-item>
        </el-form>
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="3"
          :on-exceed="handleExceed"
        >
          <el-button type="primary">Click to upload</el-button>
          <template #tip>
            <div class="el-upload__tip">
              File search enables the assistant with knowledge from files that
              you or your users upload. Once a file is uploaded, the assistant
              automatically decides when to retrieve content based on user
              requests.
            </div>
          </template>
        </el-upload>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="closeDialog">Cancel</el-button>
            <el-button type="primary" @click="submitPrompt"> Submit </el-button>
          </div>
        </template></el-dialog
      >
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
