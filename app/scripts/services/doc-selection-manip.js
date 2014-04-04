'use strict';

//most of it copied from the contributions of  http://stackoverflow.com/users/96100/tim-down
app.factory('DSM',
  function () {

    var DSM = {
      replaceSelectionWithHtml: function (html) {
        var range, node;
        if (window.getSelection && window.getSelection().getRangeAt) {
            range = window.getSelection().getRangeAt(0);
            range.deleteContents();
            var div = document.createElement("div");
            div.innerHTML = html;
            var frag = document.createDocumentFragment(), child;
            while ( (child = div.firstChild) ) {
                frag.appendChild(child);
            }
            range.insertNode(frag);
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            html = (node.nodeType === 3) ? node.data : node.outerHTML;
            range.pasteHTML(html);
        }
      },
      getSelectionHtml: function () {
        var html = "";
        if (typeof window.getSelection !== "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if (typeof document.selection !== "undefined") {
            if (document.selection.type === "Text") {
                html = document.selection.createRange().htmlText;
            }
        }
        return html;
      },
      getSelectionTextarea: function(element) {
        var textComponent = element;
        var selectedText;
        if (document.selection !== undefined) {
            textComponent.focus();
            var sel = document.selection.createRange();
            selectedText = sel.text;
        }
        else if (textComponent.selectionStart !== undefined) {
            var startPos = textComponent.selectionStart;
            var endPos = textComponent.selectionEnd;
            selectedText = textComponent.value.substring(startPos, endPos);
        }
        return selectedText;
      },
      insertHtmlAtCursor: function(html) {
        var range, node;
        if (window.getSelection && window.getSelection().getRangeAt) {
            range = window.getSelection().getRangeAt(0);
            node = range.createContextualFragment(html);
            range.insertNode(node);
        } else if (document.selection && document.selection.createRange) {
            document.selection.createRange().pasteHTML(html);
        }
      },
      getCaretHTML: function(element) {
        var caretOffset = 0;
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection !== "undefined") {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        } else if ( (sel = doc.selection) && sel.type !== "Control") {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
      },
      getCaretTextarea: function (element) {
          if (element.selectionStart) {
            return element.selectionStart;
          } else if (document.selection) {
            element.focus();

            var r = document.selection.createRange();
            if (r === null) {
              return 0;
            }

            var re = element.createTextRange(),
                rc = re.duplicate();
            re.moveToBookmark(r.getBookmark());
            rc.setEndPoint('EndToStart', re);

            return rc.text.length;
          }
          return 0;
        }
    };

    return DSM;
  });