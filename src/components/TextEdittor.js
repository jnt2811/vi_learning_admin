import { Editor } from "@tinymce/tinymce-react";

export const TextEditor = ({ value = "", setValue = () => {} }) => {
  const onEditorChange = (content) => {
    setValue(content);
  };

  return (
    <div className="text-editor">
      <Editor
        apiKey="x8w8q2wfhsbgwe8sgdg5r6iffyjwvdn3ylihwfz6lt7w4r84"
        init={{
          height: "45vh",
          plugins: [
            "advlist autolink lists link charmap image print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste wordcount",
          ],
          paste_as_text: true,
          toolbar: [
            "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",
          ],
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
        }}
        value={value}
        onEditorChange={onEditorChange}
      />
    </div>
  );
};
