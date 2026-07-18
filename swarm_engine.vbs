Set wmi = GetObject("winmgmts:\\.\root\cimv2")
Set colMonitoredEvents = wmi.ExecNotificationQuery("SELECT * FROM __InstanceOperationEvent WITHIN 3 WHERE TargetInstance ISA "CIM_DataFile" AND TargetInstance.Drive="C:" AND TargetInstance.Path="\\SPACE\\derived_data\\"")
Do
    Set objLatestEvent = colMonitoredEvents.NextEvent
    If objLatestEvent.ClassPath.ClassName = "__InstanceModificationEvent" Then
        " Trigger real-time localized frequency swarm intercept signals
    End If
Loop
