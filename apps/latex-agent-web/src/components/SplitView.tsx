import React, { useState, useEffect, useRef } from 'react';
import { Button, Tooltip } from 'antd';
import { 
  VerticalAlignTopOutlined, 
  VerticalAlignBottomOutlined, 
  VerticalAlignMiddleOutlined 
} from '@ant-design/icons';

export type SplitMode = 'left' | 'right' | 'split';

type SplitViewProps = {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultMode?: SplitMode;
  defaultRatio?: number;
  storageKey?: string;
  minRatio?: number;
  maxRatio?: number;
  className?: string;
  style?: React.CSSProperties;
};

const SplitView: React.FC<SplitViewProps> = ({
  left,
  right,
  defaultMode = 'split',
  defaultRatio = 0.5,
  storageKey = 'split-view-ratio',
  minRatio = 0.2,
  maxRatio = 0.8,
  className = '',
  style = {},
}) => {
  const [mode, setMode] = useState<SplitMode>(defaultMode);
  const [ratio, setRatio] = useState<number>(defaultRatio);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number>(0);
  const dragStartRatio = useRef<number>(0);

  // Load saved ratio from localStorage on mount
  useEffect(() => {
    const savedRatio = localStorage.getItem(storageKey);
    if (savedRatio) {
      setRatio(parseFloat(savedRatio));
    }
  }, [storageKey]);

  // Save ratio to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(storageKey, ratio.toString());
  }, [ratio, storageKey]);

  // Add global event listeners when dragging starts
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        
        const containerWidth = containerRef.current.clientWidth;
        const deltaX = e.clientX - dragStartX.current;
        const deltaRatio = deltaX / containerWidth;
        
        let newRatio = dragStartRatio.current + deltaRatio;
        newRatio = Math.max(minRatio, Math.min(maxRatio, newRatio));
        
        setRatio(newRatio);
      };
      
      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };
      
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, minRatio, maxRatio]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode !== 'split') return;
    
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartRatio.current = ratio;
  };

  const setModeAndPreserveRatio = (newMode: SplitMode) => {
    setMode(newMode);
  };

  const getLeftStyle = (): React.CSSProperties => {
    if (mode === 'left') return { width: '100%', flex: '1', overflow: 'auto' };
    if (mode === 'right') return { display: 'none' };
    return { 
      width: `${ratio * 100}%`,
      flex: 'none',
      overflow: 'auto'
    };
  };

  const getRightStyle = (): React.CSSProperties => {
    if (mode === 'left') return { display: 'none' };
    if (mode === 'right') return { width: '100%', flex: '1', overflow: 'auto' };
    return { 
      width: `${(1 - ratio) * 100}%`,
      flex: 'none',
      overflow: 'auto'
    };
  };

  const getDividerStyle = (): React.CSSProperties => {
    if (mode !== 'split') return { display: 'none' };
    return {
      width: '16px',
      cursor: 'col-resize',
      backgroundColor: isDragging ? '#1890ff' : (isHovering ? '#e6f7ff' : '#f0f0f0'),
      transition: isDragging ? 'none' : 'background-color 0.3s',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      userSelect: 'none',
      touchAction: 'none',
      position: 'relative',
    };
  };

  return (
    <div 
      ref={containerRef}
      className={`split-view ${className}`}
      style={{ 
        display: 'flex', 
        width: '100%', 
        height: '100%',
        position: 'relative',
        ...style 
      }}
    >
      <div style={getLeftStyle()}>
        {left}
      </div>
      
      <div 
        style={getDividerStyle()}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div 
          style={{ 
            width: '4px',
            height: '100%', 
            backgroundColor: isDragging ? '#1890ff' : '#d9d9d9',
            transition: isDragging ? 'none' : 'background-color 0.3s',
            borderRadius: '2px',
            boxShadow: isDragging ? '0 0 8px rgba(24, 144, 255, 0.5)' : 'none',
          }} 
        />
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '8px',
            height: '32px',
            backgroundColor: isDragging ? '#1890ff' : '#d9d9d9',
            borderRadius: '4px',
            opacity: isDragging ? 1 : 0.7,
            transition: 'all 0.3s',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div 
            style={{
              width: '2px',
              height: '16px',
              backgroundColor: '#fff',
              borderRadius: '1px',
            }}
          />
        </div>
      </div>
      
      <div style={getRightStyle()}>
        {right}
      </div>
      
      <div style={{ 
        position: 'absolute', 
        top: '8px', 
        right: '8px', 
        zIndex: 10,
        display: 'flex',
        gap: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '4px',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}>
        <Tooltip title="Show Left Panel Only">
          <Button 
            icon={<VerticalAlignTopOutlined />} 
            type={mode === 'left' ? 'primary' : 'default'}
            size="small"
            onClick={() => setModeAndPreserveRatio('left')}
          />
        </Tooltip>
        <Tooltip title="Show Split View">
          <Button 
            icon={<VerticalAlignMiddleOutlined />} 
            type={mode === 'split' ? 'primary' : 'default'}
            size="small"
            onClick={() => setModeAndPreserveRatio('split')}
          />
        </Tooltip>
        <Tooltip title="Show Right Panel Only">
          <Button 
            icon={<VerticalAlignBottomOutlined />} 
            type={mode === 'right' ? 'primary' : 'default'}
            size="small"
            onClick={() => setModeAndPreserveRatio('right')}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default SplitView; 