// /* global window, document, DOMParser */
// /* eslint-disable no-await-in-loop */
// /* eslint-disable no-restricted-syntax */
// /* eslint-disable jsx-a11y/click-events-have-key-events */
// /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { styled } from '@mui/material/styles';
// import { convertToRaw, EditorState, ContentState, AtomicBlockUtils, Modifier } from 'draft-js';
// import { Editor } from 'react-draft-wysiwyg';
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import clsx from 'clsx';
// import { Dialog, DialogContent, IconButton, Box, Tooltip, CircularProgress } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import DownloadIcon from '@mui/icons-material/Download';
// import DeleteIcon from '@mui/icons-material/Delete';

// const Root = styled('div')(({ editorHeight }) => ({
// 	'& .rdw-dropdown-selectedtext': {
// 		color: 'inherit'
// 	},
// 	'& .rdw-editor-toolbar': {
// 		borderWidth: '0 0 1px 0!important',
// 		margin: '0!important'
// 	},
// 	'& .rdw-editor-main': {
// 		padding: '8px 12px',
// 		height: `${editorHeight || 256}px!important`,
// 		overflowY: 'auto!important',
// 		'& img': {
// 			maxWidth: '100%',
// 			display: 'block',
// 			cursor: 'pointer',
// 			borderRadius: 4,
// 			border: '2px solid transparent',
// 			transition: 'border-color 0.15s ease',
// 			'&:hover': {
// 				borderColor: '#1976d2'
// 			}
// 		},
// 		'& figure': {
// 			margin: '8px 0',
// 			display: 'block'
// 		},
// 		'& ul, & ol': {
// 			paddingLeft: '20px',
// 			margin: '4px 0',
// 		},
// 		'& li': {
// 			marginBottom: '2px',
// 		}
// 	}
// }));

// // ── Custom Image Block Renderer ───────────────────────────────────────────────
// // Renders image using the proxy URL stored in the entity src.
// // The src is already a proxy URL (/api/shared/attachments/download/{id}?...)
// // so the browser fetches it through your authenticated API — not directly from Azure.
// function CustomImageComponent({ block, contentState, blockProps }) {
// 	const entityKey = block.getEntityAt(0);

// 	if (!entityKey) return null;

// 	let src = '';
// 	let alt = 'image';

// 	try {
// 		const entity = contentState.getEntity(entityKey);
// 		const data = entity.getData();
// 		src = data.src || data.url || '';
// 		alt = data.alt || 'image';
// 	} catch {
// 		return null;
// 	}

// 	if (!src) return null;

// 	const { onImageClick } = blockProps || {};

// 	return (
// 		<div
// 			style={{ textAlign: 'center', margin: '8px 0' }}
// 			contentEditable={false}
// 		>
// 			<img
// 				src={src}
// 				alt={alt}
// 				style={{
// 					maxWidth: '100%',
// 					height: 'auto',
// 					cursor: 'pointer',
// 					borderRadius: 4,
// 					border: '2px solid transparent',
// 					display: 'inline-block',
// 					transition: 'border-color 0.15s ease'
// 				}}
// 				onClick={() => onImageClick && onImageClick(src)}
// 				onMouseEnter={(e) => {
// 					e.currentTarget.style.borderColor = '#1976d2';
// 				}}
// 				onMouseLeave={(e) => {
// 					e.currentTarget.style.borderColor = 'transparent';
// 				}}
// 			/>
// 		</div>
// 	);
// }

// // ── Image Viewer Dialog ───────────────────────────────────────────────────────
// // Same pattern as AttachmentList preview — uses the proxy URL to display image.
// // Download opens the download URL (inline=false).
// // Delete calls onImageDelete and removes the block from the editor.
// function ImageViewerDialog({ open, src, onClose, onDelete, onDownload, isDeleting }) {
// 	if (!src) return null;

// 	return (
// 		<Dialog
// 			open={open}
// 			onClose={onClose}
// 			maxWidth="lg"
// 			fullWidth
// 			PaperProps={{
// 				sx: { backgroundColor: 'rgba(0,0,0,0.92)', boxShadow: 'none', borderRadius: 2 }
// 			}}
// 		>
// 			<DialogContent sx={{ p: 0, position: 'relative' }}>
// 				{/* Action bar top-right */}
// 				<Box
// 					sx={{
// 						position: 'absolute',
// 						top: 8,
// 						right: 8,
// 						zIndex: 10,
// 						display: 'flex',
// 						gap: 1,
// 						backgroundColor: 'rgba(0,0,0,0.55)',
// 						borderRadius: 2,
// 						px: 1,
// 						py: 0.5
// 					}}
// 				>
// 					{onDownload && (
// 						<Tooltip title="Download">
// 							<IconButton
// 								size="small"
// 								onClick={onDownload}
// 								sx={{ color: '#fff' }}
// 							>
// 								<DownloadIcon fontSize="small" />
// 							</IconButton>
// 						</Tooltip>
// 					)}
// 					{onDelete && (
// 						<Tooltip title="Delete image">
// 							<IconButton
// 								size="small"
// 								onClick={onDelete}
// 								disabled={isDeleting}
// 								sx={{ color: '#f87171' }}
// 							>
// 								{isDeleting ? (
// 									<CircularProgress
// 										size={16}
// 										sx={{ color: '#f87171' }}
// 									/>
// 								) : (
// 									<DeleteIcon fontSize="small" />
// 								)}
// 							</IconButton>
// 						</Tooltip>
// 					)}
// 					<Tooltip title="Close">
// 						<IconButton
// 							size="small"
// 							onClick={onClose}
// 							sx={{ color: '#fff' }}
// 						>
// 							<CloseIcon fontSize="small" />
// 						</IconButton>
// 					</Tooltip>
// 				</Box>

// 				{/* Image rendered via proxy URL — no PublicAccessNotPermitted */}
// 				<Box
// 					sx={{
// 						display: 'flex',
// 						alignItems: 'center',
// 						justifyContent: 'center',
// 						minHeight: 300,
// 						p: 2,
// 						pt: 6
// 					}}
// 				>
// 					<img
// 						src={src}
// 						alt="preview"
// 						style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 4 }}
// 					/>
// 				</Box>
// 			</DialogContent>
// 		</Dialog>
// 	);
// }

// // ── sanitizeDescriptionHtml ───────────────────────────────────────────────────
// // Strips <img> tags whose src is:
// //   - a direct Azure blob URL  (blob.core.windows.net)  → private, returns 403
// //   - "undefined" or empty string                       → renders as broken image
// // Keeps <img> tags pointing to our own proxy (/api/shared/attachments/download/...)
// function sanitizeDescriptionHtml(html) {
// 	if (!html) return '';

// 	return html.replace(/<img[^>]*>/gi, (imgTag) => {
// 		const srcMatch = imgTag.match(/src\s*=\s*["']([^"']*)["']/i);
// 		const src = srcMatch ? srcMatch[1] : '';

// 		// Strip if src is empty, the string "undefined", or a direct private blob URL
// 		if (!src || src === 'undefined' || src.includes('blob.core.windows.net')) {
// 			return '';
// 		}

// 		return imgTag;
// 	});
// }

// // ── Main WYSIWYGEditor ────────────────────────────────────────────────────────
// /**
//  * Props:
//  *  - value           : string   — HTML string (controlled externally)
//  *  - onChange        : fn(html)
//  *  - resetKey        : number   — increment to clear
//  *  - onAtDetected    : fn({ show, search })
//  *  - readOnly        : bool
//  *  - editorHeight    : number (px)
//  *  - className       : string
//  *  - onImageUpload   : async fn(file: File) => proxyUrl: string
//  *  - onImageDelete   : async fn(proxyUrl: string) => void
//  *  - getDownloadUrl  : fn(proxyUrl: string) => downloadUrl: string
//  *                      Converts inline proxy URL to a download (attachment) URL.
//  *                      If not provided, opens the proxy URL directly.
//  */
// function WYSIWYGEditorComponent(props, ref) {
// 	const {
// 		onChange,
// 		value,
// 		className = '',
// 		editorHeight = 256,
// 		readOnly,
// 		resetKey,
// 		onAtDetected,
// 		onImageUpload,
// 		onImageDelete,
// 		getDownloadUrl, // fn(proxyUrl) => downloadUrl
// 		...other
// 	} = props;

// 	const [editorState, setEditorState] = useState(EditorState.createEmpty());
// 	const initializedRef = useRef(false);
// 	const lastExternalValue = useRef('');
// 	const lastResetKey = useRef(resetKey);
// 	const editorRef = useRef(null);
// 	const wrapperRef = useRef(null);

// 	const [viewerOpen, setViewerOpen] = useState(false);
// 	const [viewerSrc, setViewerSrc] = useState('');
// 	const [isDeleting, setIsDeleting] = useState(false);

// 	const openViewer = useCallback((src) => {
// 		if (src) {
// 			setViewerSrc(src);
// 			setViewerOpen(true);
// 		}
// 	}, []);

// 	// ── Custom blockRendererFn ────────────────────────────────────────────────
// 	const blockRendererFn = useCallback(
// 		(block) => {
// 			if (block.getType() === 'atomic') {
// 				const contentState = editorState.getCurrentContent();
// 				const entityKey = block.getEntityAt(0);

// 				if (!entityKey) return null;

// 				try {
// 					const entity = contentState.getEntity(entityKey);

// 					if (entity.getType() === 'IMAGE') {
// 						return {
// 							component: CustomImageComponent,
// 							editable: false,
// 							props: { onImageClick: openViewer }
// 						};
// 					}
// 				} catch {
// 					return null;
// 				}
// 			}

// 			return null;
// 		},
// 		[editorState, openViewer]
// 	);

// 	// ── Prevent Scroll Propagation ─────────────────────────────────────────────
// 	useEffect(() => {
// 		const wrapperEl = wrapperRef.current;

// 		if (!wrapperEl) return () => {};

// 		const getScrollParent = (node) => {
// 			if (!node || node === document.body || node === document.documentElement) return null;

// 			const style = window.getComputedStyle(node);
// 			const isScrollable =
// 				style.overflowY === 'auto' || style.overflowY === 'scroll' || node.classList.contains('ps');

// 			if (isScrollable && node.scrollHeight > node.clientHeight) {
// 				return node;
// 			}

// 			return getScrollParent(node.parentNode);
// 		};

// 		const handleScrollPropagation = (e) => {
// 			const container = wrapperEl.querySelector('.rdw-editor-main');

// 			if (!container) return;

// 			const { scrollTop, scrollHeight, clientHeight } = container;
// 			const delta = e.deltaY;

// 			// If the content is not scrollable, let the parent container scroll
// 			if (scrollHeight <= clientHeight) {
// 				const scrollParent = getScrollParent(wrapperEl);

// 				if (scrollParent) {
// 					scrollParent.scrollTop += delta;
// 				}

// 				return;
// 			}

// 			// Scrolling down
// 			if (delta > 0) {
// 				const reachedBottom = scrollTop + clientHeight >= scrollHeight - 1;

// 				if (!reachedBottom) {
// 					e.stopPropagation();
// 				} else {
// 					const scrollParent = getScrollParent(wrapperEl);

// 					if (scrollParent) {
// 						scrollParent.scrollTop += delta;
// 					}
// 				}
// 			}
// 			// Scrolling up
// 			else if (delta < 0) {
// 				const reachedTop = scrollTop <= 1;

// 				if (!reachedTop) {
// 					e.stopPropagation();
// 				} else {
// 					const scrollParent = getScrollParent(wrapperEl);

// 					if (scrollParent) {
// 						scrollParent.scrollTop += delta;
// 					}
// 				}
// 			}
// 		};

// 		wrapperEl.addEventListener('wheel', handleScrollPropagation, { passive: true });

// 		return () => {
// 			wrapperEl.removeEventListener('wheel', handleScrollPropagation);
// 		};
// 	}, []);

// 	// ── Reset ─────────────────────────────────────────────────────────────────
// 	useEffect(() => {
// 		if (resetKey !== undefined && resetKey !== lastResetKey.current) {
// 			lastResetKey.current = resetKey;
// 			setEditorState(EditorState.createEmpty());
// 			initializedRef.current = false;
// 			lastExternalValue.current = '';
// 		}
// 	}, [resetKey]);

// 	// ── Initialize from external value ────────────────────────────────────────
// 	useEffect(() => {
// 		if (readOnly) {
// 			const contentBlock = htmlToDraft(sanitizeDescriptionHtml(value || ''));

// 			if (contentBlock) {
// 				const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
// 				setEditorState(EditorState.createWithContent(contentState));
// 			}

// 			return;
// 		}

// 		if (!initializedRef.current && value && value !== lastExternalValue.current) {
// 			const contentBlock = htmlToDraft(sanitizeDescriptionHtml(value));

// 			if (contentBlock) {
// 				const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
// 				setEditorState(EditorState.createWithContent(contentState));
// 				initializedRef.current = true;
// 				lastExternalValue.current = value;
// 			}
// 		}
// 	}, [value, readOnly]);

// 	// ── Keystroke handler ─────────────────────────────────────────────────────
// 	const onEditorStateChange = useCallback(
// 		(_editorState) => {
// 			initializedRef.current = true;
// 			setEditorState(_editorState);

// 			const html = draftToHtml(convertToRaw(_editorState.getCurrentContent()));
// 			lastExternalValue.current = html;
// 			onChange(html);

// 			if (onAtDetected) {
// 				const selection = _editorState.getSelection();
// 				const content = _editorState.getCurrentContent();
// 				const block = content.getBlockForKey(selection.getStartKey());
// 				const text = block.getText();
// 				const cursorPos = selection.getStartOffset();
// 				const textBeforeCursor = text.substring(0, cursorPos);
// 				const lastAt = textBeforeCursor.lastIndexOf('@');

// 				if (lastAt !== -1) {
// 					const afterAt = textBeforeCursor.substring(lastAt + 1);

// 					if (!afterAt.includes(' ') && afterAt.length < 20) {
// 						onAtDetected({ show: true, search: afterAt });
// 						return;
// 					}
// 				}

// 				onAtDetected({ show: false, search: '' });
// 			}
// 		},
// 		[onChange, onAtDetected]
// 	);

// 	// ── Insert image (proxy URL) as atomic block ──────────────────────────────
// 	const insertImageIntoEditor = useCallback(
// 		(url) => {
// 			if (!url) return;

// 			setEditorState((prevState) => {
// 				const contentState = prevState.getCurrentContent();
// 				const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', {
// 					src: url,
// 					alt: 'pasted-image',
// 					height: 'auto',
// 					width: '100%'
// 				});
// 				const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
// 				const newEditorState = EditorState.set(prevState, {
// 					currentContent: contentStateWithEntity
// 				});
// 				const nextState = AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
// 				const html = draftToHtml(convertToRaw(nextState.getCurrentContent()));
// 				lastExternalValue.current = html;
// 				onChange(html);
// 				return nextState;
// 			});
// 		},
// 		[onChange]
// 	);

// 	// ── Handle pasted image files ─────────────────────────────────────────────
// 	const handlePastedFiles = useCallback(
// 		async (files) => {
// 			if (!onImageUpload || !files || files.length === 0) return false;

// 			const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));

// 			if (imageFiles.length === 0) return false;

// 			for (const file of imageFiles) {
// 				try {
// 					const proxyUrl = await onImageUpload(file);

// 					if (proxyUrl) insertImageIntoEditor(proxyUrl);
// 				} catch (err) {
// 					console.error('Failed to upload pasted image:', err);
// 				}
// 			}

// 			return true;
// 		},
// 		[onImageUpload, insertImageIntoEditor]
// 	);

// 	// ── Handle pasted formatted HTML / Text ────────────────────────────────────
// 	// Strips layout wrappers and inline styles to prevent double spacing / gaps
// 	const handlePastedText = useCallback(
// 		(text, html, es) => {
// 			if (html) {
// 				try {
// 					const parser = new DOMParser();
// 					const doc = parser.parseFromString(html, 'text/html');

// 					// 1. Strip style, class, and id attributes from all elements
// 					const allElements = doc.querySelectorAll('*');
// 					allElements.forEach((el) => {
// 						el.removeAttribute('style');
// 						el.removeAttribute('class');
// 						el.removeAttribute('id');
// 					});

// 					let cleanedHtml = doc.body.innerHTML;

// 					// 2. Final pass with regex for safety sanitization (Azure blobs check)
// 					cleanedHtml = sanitizeDescriptionHtml(cleanedHtml);

// 					// 3. Unwrap <p> and <div> inside <li>. 
// 					// html-to-draftjs incorrectly creates an empty list item block followed by a normal text block
// 					// when a list item contains block elements, resulting in a disconnected list number.
// 					const tempDoc = parser.parseFromString(cleanedHtml, 'text/html');
// 					const listItems = tempDoc.querySelectorAll('li');
// 					listItems.forEach(li => {
// 						const innerBlocks = li.querySelectorAll('p, div');
// 						innerBlocks.forEach(block => {
// 							while (block.firstChild) {
// 								block.parentNode.insertBefore(block.firstChild, block);
// 							}
// 							block.parentNode.removeChild(block);
// 						});
// 					});

// 					// Convert <pre> and <code> to standard divs to avoid html-to-draftjs buggy code-block padded blocks
// 					const preAndCodeTags = tempDoc.querySelectorAll('pre, code');
// 					preAndCodeTags.forEach(tag => {
// 						// Preserve newlines as <br> before we lose the <pre> formatting
// 						if (tag.tagName.toLowerCase() === 'pre') {
// 							tag.innerHTML = tag.innerHTML.replace(/\n/g, '<br>');
// 						}
// 						// Change tag to div
// 						const div = tempDoc.createElement('div');
// 						div.innerHTML = tag.innerHTML;
// 						tag.parentNode.replaceChild(div, tag);
// 					});

// 					cleanedHtml = tempDoc.body.innerHTML;

// 					// 4. Remove line breaks and spaces between tags to prevent DraftJS from creating empty blocks/gaps
// 					cleanedHtml = cleanedHtml.replace(/[\r\n]+/g, ' ');
// 					cleanedHtml = cleanedHtml.replace(/>\s+</g, '><');

// 					// 5. Remove empty elements that cause large gaps
// 					cleanedHtml = cleanedHtml.replace(/<(p|div|span|h[1-6])[^>]*>(<br\s*\/?>|&nbsp;|\s)*<\/\1>/gi, '');
// 					// Run it twice to catch nested empty tags e.g. <div><p></p></div>
// 					cleanedHtml = cleanedHtml.replace(/<(p|div|span|h[1-6])[^>]*>(<br\s*\/?>|&nbsp;|\s)*<\/\1>/gi, '');

// 					const contentBlock = htmlToDraft(cleanedHtml);

// 					if (contentBlock && contentBlock.contentBlocks) {
// 						const contentState = ContentState.createFromBlockArray(
// 							contentBlock.contentBlocks,
// 							contentBlock.entityMap
// 						);
						
// 						// Ensure we process entity map correctly
// 						const blockMap = contentState.getBlockMap();
// 						const newContent = Modifier.replaceWithFragment(
// 							es.getCurrentContent(),
// 							es.getSelection(),
// 							blockMap
// 						);
// 						const nextState = EditorState.push(es, newContent, 'insert-fragment');
// 						onEditorStateChange(nextState);
// 						return 'handled';
// 					}
// 				} catch (err) {
// 					console.error('Failed to parse and clean pasted HTML:', err);
// 				}
// 			}

// 			return false;
// 		},
// 		[onEditorStateChange]
// 	);

// 	// ── Toolbar image upload callback ─────────────────────────────────────────
// 	const uploadImageCallback = useCallback(
// 		async (file) => {
// 			if (!onImageUpload) return { data: { link: '' } };

// 			try {
// 				const url = await onImageUpload(file);
// 				return { data: { link: url || '' } };
// 			} catch {
// 				return { data: { link: '' } };
// 			}
// 		},
// 		[onImageUpload]
// 	);

// 	// ── Viewer: download ──────────────────────────────────────────────────────
// 	// Uses getDownloadUrl to convert the inline proxy URL to a download URL,
// 	// which sets Content-Disposition: attachment — same as AttachmentList download.
// 	const handleViewerDownload = useCallback(() => {
// 		if (!viewerSrc) return;

// 		const downloadUrl = getDownloadUrl ? getDownloadUrl(viewerSrc) : viewerSrc;
// 		window.open(downloadUrl, '_blank', 'noreferrer');
// 	}, [viewerSrc, getDownloadUrl]);

// 	// ── Viewer: delete ────────────────────────────────────────────────────────
// 	const handleViewerDelete = useCallback(async () => {
// 		if (!viewerSrc || !onImageDelete) return;

// 		setIsDeleting(true);

// 		try {
// 			await onImageDelete(viewerSrc);

// 			// Remove the image block from editor
// 			setEditorState((prevState) => {
// 				const raw = convertToRaw(prevState.getCurrentContent());

// 				const keysToRemove = new Set(
// 					Object.entries(raw.entityMap)
// 						.filter(([, ent]) => ent.type === 'IMAGE' && ent.data?.src === viewerSrc)
// 						.map(([k]) => k)
// 				);

// 				const filteredBlocks = raw.blocks.filter(
// 					(block) =>
// 						!(block.type === 'atomic' && block.entityRanges.some((r) => keysToRemove.has(String(r.key))))
// 				);

// 				const newRaw = { ...raw, blocks: filteredBlocks };
// 				const newHtml = draftToHtml(newRaw);
// 				lastExternalValue.current = newHtml;
// 				onChange(newHtml);

// 				const contentBlock = htmlToDraft(sanitizeDescriptionHtml(newHtml));

// 				if (contentBlock) {
// 					return EditorState.createWithContent(ContentState.createFromBlockArray(contentBlock.contentBlocks));
// 				}

// 				return prevState;
// 			});

// 			setViewerOpen(false);
// 			setViewerSrc('');
// 		} catch (err) {
// 			console.error('Failed to delete image:', err);
// 		} finally {
// 			setIsDeleting(false);
// 		}
// 	}, [viewerSrc, onImageDelete, onChange]);

// 	return (
// 		<>
// 			<Root
// 				className={clsx('w-full overflow-hidden rounded border-1', className)}
// 				ref={(node) => {
// 					wrapperRef.current = node;

// 					if (typeof ref === 'function') ref(node);
// 					else if (ref) ref.current = node;
// 				}}
// 				editorHeight={editorHeight}
// 				{...other}
// 			>
// 				<Editor
// 					ref={editorRef}
// 					editorState={editorState}
// 					onEditorStateChange={onEditorStateChange}
// 					readOnly={readOnly}
// 					toolbarHidden={readOnly}
// 					customBlockRenderFunc={blockRendererFn}
// 					handlePastedFiles={onImageUpload ? handlePastedFiles : undefined}
// 					handlePastedText={handlePastedText}
// 					toolbar={
// 						onImageUpload
// 							? {
// 									image: {
// 										uploadCallback: uploadImageCallback,
// 										previewImage: true,
// 										alt: { present: false },
// 										defaultSize: { height: 'auto', width: '100%' }
// 									}
// 								}
// 							: undefined
// 					}
// 				/>
// 			</Root>

// 			<ImageViewerDialog
// 				open={viewerOpen}
// 				src={viewerSrc}
// 				onClose={() => {
// 					setViewerOpen(false);
// 					setViewerSrc('');
// 				}}
// 				onDownload={handleViewerDownload}
// 				onDelete={onImageDelete ? handleViewerDelete : null}
// 				isDeleting={isDeleting}
// 			/>
// 		</>
// 	);
// }

// const WYSIWYGEditor = React.forwardRef(WYSIWYGEditorComponent);
// export default WYSIWYGEditor;
